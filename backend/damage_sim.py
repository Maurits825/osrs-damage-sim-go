import copy
import math

from matplotlib.figure import Figure

from condition_evaluator import ConditionEvaluator
from constants import MAX_SPECIAL_ATTACK, SPEC_REGEN_TICKS, SPEC_REGEN_AMOUNT
from damage_sim_stats import DamageSimStats, TimeSimStats, SimStats
from gear_setup_input import GearSetupInput
from model.boost import BoostType, Boost
from model.locations import Location
from model.npc.combat_stats import CombatStats
from model.input_setup import InputSetup, GearSetup
from model.npc.npc_stats import NpcStats
from model.prayer import Prayer, PrayerMultiplier
from weapon import Weapon
from wiki_data import WikiData
from dataclasses import dataclass


@dataclass()
class SingleDamageSimData:
    ticks_to_kill: int
    gear_total_dmg: list[int]
    gear_attack_count: list[int]
    gear_dps: list[float]


@dataclass()
class TotalDamageSimData:
    ticks_to_kill: list[int]
    gear_total_dmg: list[list[int]]
    gear_attack_count: list[list[int]]
    gear_dps: list[list[float]]


@dataclass()
class DamageSimResults:
    ttk_stats_list: list[TimeSimStats]
    total_damage_stats_list: list[list[SimStats]]
    attack_count_stats_list: list[list[SimStats]]
    sim_dps_stats_list: list[list[SimStats]]
    theoretical_dps_list: list[list[float]]
    cumulative_chances_list: list[list[float]]
    figure: Figure


class DamageSim:
    def __init__(self, show_plots):
        self.damage_sim_stats = DamageSimStats(show_plots)
        self.initial_npc_stats = None

    def get_input_setup(self) -> InputSetup:
        # first get inputs
        # TODO input for this
        raid_level = 300
        path_level = 0
        team_size = 1
        # TODO get npc by name
        #npc = WikiData.get_npc(11751)  # Obelisk
        #npc = WikiData.get_npc(11762)  # Tumeken's Warden
        # npc = self.wiki_data.get_npc(11797)  # akkah shadow
        #npc = self.wiki_data.get_npc(11778)  # Ba-Ba
        npc = WikiData.get_npc(11730)  # Zebak
        #npc = self.wiki_data.get_npc(11719)  # Kephri
        # TODO do this here?
        if npc.location == Location.TOMBS_OF_AMASCUT:
            path_level_mult = 0.08 if path_level > 0 else 0.05
            npc.combat_stats.hitpoints = int(
                round(npc.combat_stats.hitpoints/10 * (1 + raid_level * 0.004) * (1 + (path_level - 1) * 0.05 + path_level_mult) * team_size, 0) * 10
            )
        # TODO better way? - this is input, non boosted stats
        combat_stats = CombatStats(99, 99, 99, 99, 99, 99)
        # TODO as input maybe or something, list or setup names
        # TODO prayer input here?
        # GearSetupInput.load_gear_setup("Max bone dagger", "Lunge", [Prayer.PIETY], 1, True),
        # GearSetupInput.load_gear_setup("Max ZCB", "Rapid", [Prayer.RIGOUR], 2, True),
        # GearSetupInput.load_gear_setup("Max dragon claws", "Slash", [Prayer.PIETY], 1, True),
        # GearSetupInput.load_gear_setup("Max Tbow", "Rapid", [Prayer.RIGOUR])
        # GearSetupInput.load_gear_setup("Max BGS", "Slash", [Prayer.PIETY], 2, True),
        # GearSetupInput.load_gear_setup("Max fang", "Lunge", [Prayer.PIETY])
        # GearSetupInput.load_gear_setup("Max blowpipe", "Rapid", [Prayer.RIGOUR])
        # GearSetupInput.load_gear_setup("Max scythe", "Chop", [Prayer.PIETY])
        gear_setups = [
            [
                GearSetupInput.load_gear_setup("Max ZCB", "Rapid", [Prayer.RIGOUR],
                                               [Boost(BoostType.SMELLING_SALTS)], combat_stats, 3, True),
                GearSetupInput.load_gear_setup("Max Tbow", "Rapid", [Prayer.RIGOUR],
                                               [Boost(BoostType.SMELLING_SALTS)], combat_stats)
            ],

        ]

        # TODO set cmb stats,prayers & gear bonus here?
        for gear_setup in gear_setups:
            for gear in gear_setup:
                gear.weapon.set_combat_stats(gear.combat_stats)
                if gear.prayers:
                    gear.weapon.set_prayer(PrayerMultiplier.sum_prayers(gear.prayers))

                # TODO make a func for this?
                gear.weapon.set_total_gear_stats(gear.gear_stats)
                if "blowpipe" in gear.gear_stats.name:  # TODO where to put this
                    gear.gear_stats.ranged_strength += 35

                gear.weapon.set_npc(npc)
                gear.weapon.set_raid_level(raid_level)

                gear.weapon.update_attack_roll()
                gear.weapon.update_max_hit()

        return InputSetup(
            npc=npc,
            gear_setups=gear_setups,
            raid_level=raid_level,
            path_level=path_level,
        )

    def run(self, iterations, input_setup) -> DamageSimResults:
        self.initial_npc_stats = copy.deepcopy(input_setup.npc)
        self.damage_sim_stats.reset_plots()

        # TODO refactor print stuff to just return text, then decide to print or just return
        max_ticks = 0
        min_ticks = math.inf
        ttk_stats_list = []
        sim_dps_stats_list = []
        total_damage_stats_list = []
        attack_count_stats_list = []
        theoretical_dps_list = []
        cummulative_chances_list = []
        for gear_setup in input_setup.gear_setups:
            sim_data = self.run_simulator(iterations, gear_setup)

            ttk_stats = DamageSimStats.get_data_stats(sim_data.ticks_to_kill, DamageSimStats.get_gear_setup_label(gear_setup))
            ttk_stats_list.append(DamageSimStats.get_ticks_stats(ttk_stats))

            sim_dps_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_dps, gear_setup)
            sim_dps_stats_list.append(sim_dps_stats)

            total_damage_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_total_dmg, gear_setup)
            total_damage_stats_list.append(total_damage_stats)

            attack_count_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_attack_count, gear_setup)
            attack_count_stats_list.append(attack_count_stats)

            cummulative_chances_list.append(list(DamageSimStats.get_cumulative_sum(sim_data.ticks_to_kill)))

            theoretical_dps = []
            for gear in gear_setup:
                gear.weapon.set_npc(copy.deepcopy(self.initial_npc_stats))
                theoretical_dps.append(gear.weapon.get_dps())
            DamageSimStats.print_setup(gear_setup, total_damage_stats)
            theoretical_dps_list.append(theoretical_dps)

            for idx, dps in enumerate(sim_dps_stats):
                DamageSimStats.print_stats(dps, gear_setup[idx].name + " Sim DPS")
            DamageSimStats.print_ticks_stats(ttk_stats, "Time")
            print("")

            max_ticks = max(max_ticks, ttk_stats.maximum)
            min_ticks = min(min_ticks, ttk_stats.minimum)
            self.damage_sim_stats.graph_n_cumulative_tick_count(sim_data.ticks_to_kill, gear_setup)

        figure = self.damage_sim_stats.show_cumulative_graph(min_ticks, max_ticks, input_setup, iterations, self.initial_npc_stats.combat_stats.hitpoints)

        return DamageSimResults(ttk_stats_list, total_damage_stats_list, attack_count_stats_list, sim_dps_stats_list,
                                theoretical_dps_list, cummulative_chances_list, figure)

    def run_simulator(self, iterations, gear_setup: list[GearSetup]) -> TotalDamageSimData:
        total_damage_sim_data = TotalDamageSimData([], [], [], [])
        for i in range(iterations):
            dmg_sim_data = self.run_damage_sim(gear_setup)
            total_damage_sim_data.ticks_to_kill.append(dmg_sim_data.ticks_to_kill)
            total_damage_sim_data.gear_total_dmg.append(dmg_sim_data.gear_total_dmg)
            total_damage_sim_data.gear_attack_count.append(dmg_sim_data.gear_attack_count)
            total_damage_sim_data.gear_dps.append(dmg_sim_data.gear_dps)
        return total_damage_sim_data

    def run_damage_sim(self, all_gear_setups: list[GearSetup]) -> SingleDamageSimData:
        ticks_to_kill = 0
        current_weapon_att_count = 0
        weapons_index = 0

        gear_setups = []
        fill_setups = []
        fill_gear_damage = []
        fill_gear_att_count = []
        fill_gear_indices = []
        last_fill_gear_used = -1
        for idx, setup in enumerate(all_gear_setups):
            if setup.is_fill:
                fill_setups.append(setup)
                fill_gear_damage.append([])
                fill_gear_att_count.append(0)
                fill_gear_indices.append(idx)
            else:
                gear_setups.append(setup)

        gear_setup = gear_setups[weapons_index]
        weapon: Weapon = gear_setup.weapon
        npc: NpcStats = (copy.deepcopy(self.initial_npc_stats))
        weapon.set_npc(npc)

        gear_dps = []
        gear_damage = []
        gear_total_dmg = []
        gear_att_count = []

        special_attack = MAX_SPECIAL_ATTACK
        spec_regen_tick_counter = -weapon.attack_speed  # start with -attack for first loop

        while npc.combat_stats.hitpoints > 0:
            last_fill_gear_used = -1

            if special_attack == MAX_SPECIAL_ATTACK:
                spec_regen_tick_counter = 0
            else:
                spec_regen_tick_counter += weapon.attack_speed

            if spec_regen_tick_counter >= SPEC_REGEN_TICKS:
                spec_regen_tick_counter -= SPEC_REGEN_TICKS
                special_attack = min(special_attack + SPEC_REGEN_AMOUNT, MAX_SPECIAL_ATTACK)

            for idx, setup in enumerate(fill_setups):
                if ConditionEvaluator.evaluate_condition(setup.conditions, npc.combat_stats.hitpoints,
                                                         sum(fill_gear_damage[idx])):
                    # TODO duplicate code... -> refactor to function or maybe even class?
                    fill_weapon = fill_setups[idx].weapon
                    if fill_weapon.special_attack_cost <= special_attack: # TODO check if acutally a spec weapon?
                        fill_weapon.set_npc(npc)
                        damage = fill_weapon.roll_damage()
                        npc.combat_stats.hitpoints -= damage
                        fill_gear_damage[idx].append(damage)
                        fill_gear_att_count[idx] += 1

                        ticks_to_kill += fill_weapon.attack_speed
                        last_fill_gear_used = idx

                        special_attack -= fill_weapon.special_attack_cost # TODO check if spec regen is correct after using here

                    continue

            if last_fill_gear_used >= 0:
                weapon.set_npc(npc)
                continue

            if current_weapon_att_count >= gear_setup.attack_count:
                gear_dps.append(DamageSim.get_dps(gear_damage, current_weapon_att_count, weapon.attack_speed))
                gear_total_dmg.append(sum(gear_damage))
                gear_att_count.append(current_weapon_att_count)

                current_weapon_att_count = 0
                gear_damage.clear()

                weapons_index += 1
                gear_setup = gear_setups[weapons_index]
                weapon = gear_setup.weapon
                weapon.set_npc(npc)

            damage = weapon.roll_damage()
            npc.combat_stats.hitpoints -= damage

            gear_damage.append(damage)
            current_weapon_att_count += 1
            ticks_to_kill += weapon.attack_speed

        # remove overkill damage
        # remove the last weapon att, overkill attack speed only relevant if att something else after
        if last_fill_gear_used >= 0:
            fill_gear_damage[last_fill_gear_used][-1] += npc.combat_stats.hitpoints
            ticks_to_kill -= fill_setups[last_fill_gear_used].weapon.attack_speed
        else:
            gear_damage[-1] = gear_damage[-1] + npc.combat_stats.hitpoints
            ticks_to_kill -= weapon.attack_speed

        # add one tick because it dies on this tick
        ticks_to_kill += 1
        gear_dps.append(DamageSim.get_dps(gear_damage, current_weapon_att_count, weapon.attack_speed))
        gear_total_dmg.append(sum(gear_damage))
        gear_att_count.append(current_weapon_att_count)

        # pad unused setups with zeros
        for _ in range(len(gear_dps), len(gear_setups)):
            gear_dps.append(0)
            gear_total_dmg.append(0)
            gear_att_count.append(0)

        # add in fill gear stats
        for idx, setup in enumerate(fill_setups):
            gear_total_dmg.insert(idx + 1, sum(fill_gear_damage[idx]))
            gear_att_count.insert(idx + 1, fill_gear_att_count[idx])
            gear_dps.insert(idx + 1, DamageSim.get_dps(fill_gear_damage[idx], fill_gear_att_count[idx],
                                                       setup.weapon.attack_speed))

        return SingleDamageSimData(ticks_to_kill, gear_total_dmg, gear_att_count, gear_dps)

    @staticmethod
    def get_dps(damages, attack_count, attack_speed):
        if attack_count == 0:
            return 0
        return sum(damages) / (attack_count * attack_speed * 0.6)


if __name__ == '__main__':
    sim = DamageSim(True)
    sim.run(20000, sim.get_input_setup())
