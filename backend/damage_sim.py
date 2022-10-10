import copy
import math

from constants import TOA_PATH_LEVEL_NPCS
from damage_sim_stats import DamageSimStats
from gear_setup_input import GearSetupInput
from model.boost import BoostType, Boost
from model.npc.combat_stats import CombatStats
from model.input_setup import InputSetup, GearSetup
from model.npc.npc_stats import NpcStats
from model.prayer import Prayer, PrayerMultiplier
from weapon import Weapon
from wiki_data import WikiData
from dataclasses import dataclass


@dataclass()
class DamageSimData:
    ticks_to_kill: int
    weapon_damages: dict


class DamageSim:
    def __init__(self):
        self.damage_sim_stats = DamageSimStats()
        self.initial_npc_stats = None

    def get_input_setup(self) -> InputSetup:
        # first get inputs
        # TODO input for this
        raid_level = 500
        path_level = 3
        team_size = 1
        # TODO get npc by name
        #npc = WikiData.get_npc(11751)  # Obelisk
        #npc = self.wiki_data.get_npc(11762)  # Tumeken's Warden
        # npc = self.wiki_data.get_npc(11797)  # akkah shadow
        #npc = self.wiki_data.get_npc(11778)  # Ba-Ba
        npc = WikiData.get_npc(11730)  # Zebak
        #npc = self.wiki_data.get_npc(11719)  # Kephri
        # TODO do this here?
        if npc.name in TOA_PATH_LEVEL_NPCS:
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
                GearSetupInput.load_gear_setup("My 500 tbow", "Rapid", [Prayer.RIGOUR], [Boost(BoostType.SMELLING_SALTS)], combat_stats)
            ],
            [
                GearSetupInput.load_gear_setup("My 500 tbow", "Rapid", [Prayer.RIGOUR],
                                               [Boost(BoostType.RANGED_POT)], combat_stats)
            ],
            [
                GearSetupInput.load_gear_setup("My 500 BGS", "Slash", [Prayer.PIETY],[Boost(BoostType.SMELLING_SALTS)], combat_stats, 2, True),
                GearSetupInput.load_gear_setup("My 500 tbow", "Rapid", [Prayer.RIGOUR],
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

    def run(self, iterations, input_setup):
        self.initial_npc_stats = copy.deepcopy(input_setup.npc)
        printed_text = []

        # TODO refactor print stuff to just return text, then decide to print or just return
        max_ticks = 0
        min_ticks = math.inf
        for gear_setup in input_setup.gear_setups:
            ticks_to_kill, weapon_sim_dps = self.run_simulator(iterations, gear_setup)
            ttk_stats = DamageSimStats.get_data_stats(ticks_to_kill)
            sim_dps_stats = DamageSimStats.get_data_2d_stats(weapon_sim_dps)

            for gear in gear_setup:
                gear.weapon.set_npc(copy.deepcopy(self.initial_npc_stats))
            printed_text.append(DamageSimStats.print_setup(gear_setup, sim_dps_stats))

            for idx, dps in enumerate(sim_dps_stats):
                printed_text.append(DamageSimStats.print_stats(dps, gear_setup[idx].name + " Sim DPS"))
            printed_text.append(DamageSimStats.print_ticks_stats(ttk_stats, "Time"))
            print("")

            max_ticks = max(max_ticks, ttk_stats.maximum)
            min_ticks = min(min_ticks, ttk_stats.minimum)
            self.damage_sim_stats.graph_n_cumulative_tick_count(ticks_to_kill, gear_setup)

        figure = self.damage_sim_stats.show_cumulative_graph(min_ticks, max_ticks, input_setup, iterations, self.initial_npc_stats.combat_stats.hitpoints)

        return printed_text, figure

    def run_simulator(self, iterations, gear_setup: list[GearSetup]) -> (list, list):
        ticks_to_kill_list = []
        weapon_sim_dps_list = []
        for i in range(iterations):
            ticks_to_kill, weapon_sim_dps = self.run_damage_sim(gear_setup)
            ticks_to_kill_list.append(ticks_to_kill)
            weapon_sim_dps_list.append(weapon_sim_dps)

        return ticks_to_kill_list, weapon_sim_dps_list

    def run_damage_sim(self, gear_setups: list[GearSetup]) -> (int, list):
        ticks_to_kill = 0
        current_weapon_att_count = 0
        weapons_index = 0
        weapon_damages = []

        # TODO lots of dupe code
        gear_setup = gear_setups[weapons_index]
        weapon: Weapon = gear_setup.weapon
        npc: NpcStats = (copy.deepcopy(self.initial_npc_stats))
        weapon.set_npc(npc)
        weapon_sim_dps = []

        while npc.combat_stats.hitpoints > 0:
            if current_weapon_att_count >= gear_setup.attack_count:
                ticks_to_kill += current_weapon_att_count * weapon.attack_speed
                weapon_sim_dps.append(sum(weapon_damages) / (current_weapon_att_count * weapon.attack_speed * 0.6))

                current_weapon_att_count = 0
                weapon_damages.clear()

                weapons_index += 1
                gear_setup = gear_setups[weapons_index]
                weapon = gear_setup.weapon
                weapon.set_npc(npc)

            damage = weapon.roll_damage()
            npc.combat_stats.hitpoints -= damage

            weapon_damages.append(damage)
            current_weapon_att_count += 1

        # TODO sim dps is with overkill damage
        weapon_sim_dps.append(sum(weapon_damages) / (current_weapon_att_count * weapon.attack_speed * 0.6))
        # TODO by default remove the last weapon att
        ticks_to_kill += (current_weapon_att_count - 1) * weapon.attack_speed

        for _ in range(len(weapon_sim_dps), len(gear_setups)):
            weapon_sim_dps.append(0)

        return ticks_to_kill, weapon_sim_dps


if __name__ == '__main__':
    sim = DamageSim()
    sim.run(20000, sim.get_input_setup())
