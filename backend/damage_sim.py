import copy
import math

from matplotlib.figure import Figure

from condition_evaluator import ConditionEvaluator
from constants import MAX_SPECIAL_ATTACK, SPEC_REGEN_TICKS, SPEC_REGEN_AMOUNT
from damage_sim_stats import DamageSimStats, TimeSimStats, SimStats
from gear_ids import LIGHTBEARER
from model.boost import BoostType
from model.input_setup import InputSetup
from model.npc.npc_stats import NpcStats
from weapon import Weapon
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

    def run(self, iterations, input_setup: InputSetup) -> DamageSimResults:
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
        cumulative_chances_list = []
        for weapon_setups in input_setup.all_weapons_setups:
            sim_data = self.run_simulator(iterations, weapon_setups)

            ttk_stats = DamageSimStats.get_data_stats(
                sim_data.ticks_to_kill, DamageSimStats.get_weapon_setup_label(weapon_setups)
            )
            ttk_stats_list.append(DamageSimStats.get_ticks_stats(ttk_stats))

            sim_dps_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_dps, weapon_setups)
            sim_dps_stats_list.append(sim_dps_stats)

            total_damage_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_total_dmg, weapon_setups)
            total_damage_stats_list.append(total_damage_stats)

            attack_count_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_attack_count, weapon_setups)
            attack_count_stats_list.append(attack_count_stats)

            cumulative_chances_list.append(list(DamageSimStats.get_cumulative_sum(sim_data.ticks_to_kill)))

            theoretical_dps = []
            for weapon in weapon_setups:
                weapon.set_npc(copy.deepcopy(self.initial_npc_stats))
                theoretical_dps.append(weapon.get_dps())

            DamageSimStats.print_setup(weapon_setups, total_damage_stats)
            theoretical_dps_list.append(theoretical_dps)

            for idx, dps in enumerate(sim_dps_stats):
                DamageSimStats.print_stats(dps, weapon_setups[idx].gear_setup.name + " Sim DPS")
            DamageSimStats.print_ticks_stats(ttk_stats, "Time")
            print("")

            max_ticks = max(max_ticks, ttk_stats.maximum)
            min_ticks = min(min_ticks, ttk_stats.minimum)
            self.damage_sim_stats.graph_n_cumulative_tick_count(sim_data.ticks_to_kill, weapon_setups)

        figure = self.damage_sim_stats.show_cumulative_graph(min_ticks, max_ticks, input_setup, iterations,
                                                             self.initial_npc_stats.combat_stats.hitpoints)

        return DamageSimResults(ttk_stats_list, total_damage_stats_list, attack_count_stats_list, sim_dps_stats_list,
                                theoretical_dps_list, cumulative_chances_list, figure)

    def run_simulator(self, iterations, weapon_setups: list[Weapon]) -> TotalDamageSimData:
        total_damage_sim_data = TotalDamageSimData([], [], [], [])
        for i in range(iterations):
            dmg_sim_data = self.run_damage_sim(weapon_setups)
            total_damage_sim_data.ticks_to_kill.append(dmg_sim_data.ticks_to_kill)
            total_damage_sim_data.gear_total_dmg.append(dmg_sim_data.gear_total_dmg)
            total_damage_sim_data.gear_attack_count.append(dmg_sim_data.gear_attack_count)
            total_damage_sim_data.gear_dps.append(dmg_sim_data.gear_dps)
        return total_damage_sim_data

    def run_damage_sim(self, all_gear_setups: list[Weapon]) -> SingleDamageSimData:
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
        spec_regen_tick_counter = 0
        spec_regen_ticks = SPEC_REGEN_TICKS

        # TODO handle special attack with attack count, maybe just dont allow?
        # TODO then add a attack count condition?
        while npc.combat_stats.hitpoints > 0:
            if special_attack == MAX_SPECIAL_ATTACK:
                spec_regen_tick_counter = 0
            else:
                if last_fill_gear_used >= 0:
                    last_gear_setup = fill_setups[last_fill_gear_used]
                else:
                    last_gear_setup = gear_setup

                spec_regen_tick_counter += last_gear_setup.weapon.attack_speed
                if LIGHTBEARER in last_gear_setup.gear["id"]:
                    spec_regen_ticks = SPEC_REGEN_TICKS / 2
                else:
                    spec_regen_ticks = SPEC_REGEN_TICKS

            if spec_regen_tick_counter >= spec_regen_ticks:
                spec_regen_tick_counter -= spec_regen_ticks
                special_attack = min(special_attack + SPEC_REGEN_AMOUNT, MAX_SPECIAL_ATTACK)

            last_fill_gear_used = -1

            for idx, setup in enumerate(fill_setups):
                if ConditionEvaluator.evaluate_condition(setup.conditions, npc.combat_stats.hitpoints,
                                                         sum(fill_gear_damage[idx]), fill_gear_att_count[idx]):
                    # TODO duplicate code... -> refactor to function or maybe even class?
                    fill_weapon = fill_setups[idx].weapon

                    if any(boost.boost_type == BoostType.LIQUID_ADRENALINE for boost in fill_setups[idx].boosts):
                        special_attack_cost = fill_weapon.special_attack_cost / 2
                    else:
                        special_attack_cost = fill_weapon.special_attack_cost

                    if not fill_weapon.is_special_attack or \
                            (fill_weapon.is_special_attack and special_attack_cost <= special_attack):
                        fill_weapon.set_npc(npc)
                        damage = fill_weapon.roll_damage()
                        npc.combat_stats.hitpoints -= damage
                        fill_gear_damage[idx].append(damage)
                        fill_gear_att_count[idx] += 1

                        ticks_to_kill += fill_weapon.attack_speed
                        last_fill_gear_used = idx

                        special_attack -= special_attack_cost

                    break

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
            insert_index = fill_gear_indices[idx]
            gear_total_dmg.insert(insert_index, sum(fill_gear_damage[idx]))
            gear_att_count.insert(insert_index, fill_gear_att_count[idx])
            gear_dps.insert(insert_index, DamageSim.get_dps(fill_gear_damage[idx], fill_gear_att_count[idx],
                                                            setup.weapon.attack_speed))

        return SingleDamageSimData(ticks_to_kill, gear_total_dmg, gear_att_count, gear_dps)

    # TODO should this be here?
    @staticmethod
    def get_dps(damages, attack_count, attack_speed):
        if attack_count == 0:
            return 0
        return sum(damages) / (attack_count * attack_speed * 0.6)
