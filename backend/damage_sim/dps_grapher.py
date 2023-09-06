import copy

from damage_sim.damage_sim_graph import DamageSimGraph
from damage_sim.damage_sim_stats import DamageSimStats
from input_setup.input_setup_converter import InputSetupConverter
from model.boost import Boost
from model.damage_sim_results.dps_graph_data import DpsGraphData, DpsGraphDpsData
from model.damage_sim_results.dps_grapher_results import DpsGrapherResults
from model.input_setup.dps_grapher_input import DpsGrapherInput, InputValueType, INPUT_VALUE_TYPE_LABEL, \
    STAT_DRAIN_INPUT_TYPE, LEVEL_INPUT_TYPE
from model.input_setup.global_settings import GlobalSettings
from model.input_setup.input_gear_setup import InputGearSetup
from model.input_setup.stat_drain import StatDrain
from model.stat_drain_type import StatDrainType
from weapons.custom_weapon import CUSTOM_WEAPONS


class DpsGrapher:
    def __init__(self, damage_sim_graph: DamageSimGraph):
        self.damage_sim_graph = damage_sim_graph

    def run(self, dps_grapher_input: DpsGrapherInput) -> DpsGrapherResults:
        dps_data = []
        grapher_type = dps_grapher_input.settings.type
        input_setup = dps_grapher_input.input_setup
        input_value_range = range(dps_grapher_input.settings.min, dps_grapher_input.settings.max + 1)
        for input_gear_setup in input_setup.input_gear_setups:
            input_gear_setup_label = DamageSimStats.get_input_gear_setup_label(input_gear_setup).input_gear_setup_label

            DpsGrapher.drain_stats(input_gear_setup.gear_setup_settings.stat_drains, input_gear_setup.main_weapon.npc)
            dps_list = self.get_gear_setup_dps(input_setup.global_settings, input_gear_setup,
                                               grapher_type, input_value_range)
            dps_data.append(
                DpsGraphDpsData(label=input_gear_setup_label, dps=dps_list)
            )

        dps_graph_data = DpsGraphData(
            title="Dps: " + DamageSimStats.get_dps_graph_label(input_setup.global_settings),
            x_values=input_value_range,
            x_label=INPUT_VALUE_TYPE_LABEL[grapher_type],
            dps_data=dps_data
        )

        graph = self.damage_sim_graph.get_dps_graphs(dps_graph_data)
        return DpsGrapherResults(
            graph=graph
        )

    def get_gear_setup_dps(self,  global_settings: GlobalSettings, input_gear_setup: InputGearSetup,
                           grapher_type: InputValueType, input_value_range) -> list[float]:
        npc = input_gear_setup.main_weapon.npc

        weapon_dps = []
        if grapher_type in STAT_DRAIN_INPUT_TYPE:
            weapon_dps = DpsGrapher.stat_drain_dps(input_gear_setup, grapher_type, input_value_range, npc)
        elif grapher_type in LEVEL_INPUT_TYPE:
            weapon_dps = DpsGrapher.level_dps(input_gear_setup, grapher_type, input_value_range, npc)
        elif grapher_type == InputValueType.NPC_HITPOINTS:
            weapon_dps = DpsGrapher.npc_hitpoints_dps(input_gear_setup, input_value_range, npc)
        elif grapher_type == InputValueType.TOA_RAID_LEVEL:
            weapon_dps = DpsGrapher.raid_level_dps(global_settings, input_gear_setup, input_value_range, npc)

        return weapon_dps

    @staticmethod
    def drain_stats(stat_drains, npc):
        for stat_drain in stat_drains:
            if stat_drain.weapon.stat_drain_type == StatDrainType.DAMAGE:
                stat_drain.weapon.drain_stats(npc, stat_drain.value)
            else:
                for hit in range(stat_drain.value):
                    stat_drain.weapon.drain_stats(npc, 1)

    @staticmethod
    def stat_drain_dps(input_gear_setup: InputGearSetup, grapher_type: InputValueType, input_value_range, npc):
        weapon_dps = []

        Boost.apply_boosts(input_gear_setup.gear_setup_settings.combat_stats,
                           input_gear_setup.gear_setup_settings.boosts)

        stat_drain = StatDrain(CUSTOM_WEAPONS[grapher_type.value], 0)
        for input_value in input_value_range:
            npc.combat_stats.set_stats(npc.base_combat_stats)
            stat_drain.value = input_value

            if stat_drain.weapon.stat_drain_type == StatDrainType.DAMAGE:
                stat_drain.weapon.drain_stats(npc, stat_drain.value)
            else:
                for hit in range(stat_drain.value):
                    stat_drain.weapon.drain_stats(npc, 1)
            input_gear_setup.main_weapon.update_dps_stats()
            weapon_dps.append(input_gear_setup.main_weapon.get_dps())

        return weapon_dps

    @staticmethod
    def level_dps(input_gear_setup: InputGearSetup, grapher_type: InputValueType, input_value_range, npc):
        weapon_dps = []
        initial_combat_stats = copy.deepcopy(input_gear_setup.gear_setup_settings.combat_stats)

        for input_value in input_value_range:
            npc.combat_stats.set_stats(npc.base_combat_stats)
            input_gear_setup.gear_setup_settings.combat_stats.set_stats(initial_combat_stats)

            if grapher_type == InputValueType.ATTACK:
                input_gear_setup.gear_setup_settings.combat_stats.attack = input_value
            elif grapher_type == InputValueType.STRENGTH:
                input_gear_setup.gear_setup_settings.combat_stats.strength = input_value
            elif grapher_type == InputValueType.RANGED:
                input_gear_setup.gear_setup_settings.combat_stats.ranged = input_value
            elif grapher_type == InputValueType.MAGIC:
                input_gear_setup.gear_setup_settings.combat_stats.magic = input_value

            Boost.apply_boosts(input_gear_setup.gear_setup_settings.combat_stats,
                               input_gear_setup.gear_setup_settings.boosts)

            input_gear_setup.main_weapon.update_dps_stats()
            weapon_dps.append(input_gear_setup.main_weapon.get_dps())

        return weapon_dps

    @staticmethod
    def npc_hitpoints_dps(input_gear_setup: InputGearSetup, input_value_range, npc):
        weapon_dps = []

        Boost.apply_boosts(input_gear_setup.gear_setup_settings.combat_stats,
                           input_gear_setup.gear_setup_settings.boosts)

        for input_value in input_value_range:
            npc.base_combat_stats.hitpoints = input_value
            npc.combat_stats.set_stats(npc.base_combat_stats)
            input_gear_setup.main_weapon.update_dps_stats()
            weapon_dps.append(input_gear_setup.main_weapon.get_dps())

        return weapon_dps

    @staticmethod
    def raid_level_dps(global_settings, input_gear_setup: InputGearSetup, input_value_range, npc):
        weapon_dps = []

        Boost.apply_boosts(input_gear_setup.gear_setup_settings.combat_stats,
                           input_gear_setup.gear_setup_settings.boosts)
        initial_npc_stats = copy.deepcopy(npc.base_combat_stats)
        for input_value in input_value_range:
            npc.base_combat_stats.set_stats(initial_npc_stats)
            InputSetupConverter.scale_toa(
                npc,
                input_value,
                global_settings.path_level,
                global_settings.team_size
            )
            npc.combat_stats.set_stats(npc.base_combat_stats)
            DpsGrapher.drain_stats(input_gear_setup.gear_setup_settings.stat_drains, input_gear_setup.main_weapon.npc)
            input_gear_setup.main_weapon.raid_level = input_value
            input_gear_setup.main_weapon.update_dps_stats()
            weapon_dps.append(input_gear_setup.main_weapon.get_dps())

        return weapon_dps
