from __future__ import annotations

import math

import numpy as np

from constant import TICK_LENGTH
from model.boost import BoostType
from model.damage_sim_results.damage_sim_results import TotalDamageSimData, DamageSimResult, InputGearSetupLabels, \
    GearSetupDpsStats
from model.damage_sim_results.detailed_run import DetailedRun, TickDataDetails
from model.damage_sim_results.tick_data import TickData
from model.input_setup.gear_setup_settings import GearSetupSettings
from model.input_setup.global_settings import GlobalSettings
from model.input_setup.input_gear_setup import InputGearSetup
from model.input_setup.stat_drain import StatDrain
from model.npc.combat_stats import CombatStats
from model.npc.npc_stats import NpcStats
from model.sim_stats import SimStats, TimeSimStats
from model.stat_drain_type import StatDrainType
from weapons.custom_weapons.accursed_sceptre import AccursedSceptre
from weapons.custom_weapons.arclight import Arclight
from weapons.custom_weapons.bandos_godsword import BandosGodsword
from weapons.custom_weapons.barrelchest_anchor import BarrelchestAnchor
from weapons.custom_weapons.bone_dagger import BoneDagger
from weapons.custom_weapons.dragon_warhammer import DragonWarhammer
from weapons.weapon import Weapon

BOOST_NAME = {
    BoostType.SMELLING_SALTS: "Salt",
    BoostType.SUPER_ATTACK: "Super att",
    BoostType.SUPER_STRENGTH: "Super str",
    BoostType.SUPER_COMBAT: "SCP",
    BoostType.RANGING: "Ranged",
    BoostType.LIQUID_ADRENALINE: "Adrenaline",
    BoostType.OVERLOAD_PLUS: "Overload+",
}

STAT_DRAIN_NAME = {
    DragonWarhammer: "DWH",
    BandosGodsword: "BGS",
    Arclight: "Arclight",
    BoneDagger: "Bone dagger",
    AccursedSceptre: "Accursed sceptre",
    BarrelchestAnchor: "Barrelchest anchor",
}

STAT_DRAIN_TYPE = {
    StatDrainType.DAMAGE: "dmg",
    StatDrainType.HITS: "hits",
}

MAX_COMBAT_STATS = 99

CHANCE_TO_KILL_PERCENT = 0.5


class DamageSimStats:
    @staticmethod
    def get_data_stats(data) -> SimStats:
        np_data = np.array(data)
        average = np.average(np_data)
        maximum = np.max(np_data)
        minimum = np.min(np_data)

        cumulative_sum = DamageSimStats.get_cumulative_sum(data)
        chance_to_kill = np.argmax(cumulative_sum >= CHANCE_TO_KILL_PERCENT)

        try:
            frequent = int(np.argmax(np.bincount(np_data)))
        except TypeError:
            frequent = 0

        return SimStats(float(average), float(maximum), float(minimum), int(frequent), int(chance_to_kill))

    @staticmethod
    def get_ticks_stats(sim_stats: SimStats) -> TimeSimStats:
        return TimeSimStats(
            DamageSimStats.format_ticks_to_time(sim_stats.average),
            DamageSimStats.format_ticks_to_time(sim_stats.maximum),
            DamageSimStats.format_ticks_to_time(sim_stats.minimum),
            DamageSimStats.format_ticks_to_time(sim_stats.most_frequent),
            DamageSimStats.format_ticks_to_time(sim_stats.chance_to_kill),
        )

    @staticmethod
    def get_data_2d_stats(data_list2d) -> list[SimStats]:
        sim_stats_list = []
        data_list = []
        for index in range(len(data_list2d[0])):
            for data in data_list2d:
                data_list.append(data[index])

            sim_stats_list.append(DamageSimStats.get_data_stats(data_list))
            data_list.clear()
        return sim_stats_list

    @staticmethod
    def print_ticks_stats(stats: SimStats, label: str):
        text = label + ": Average: " + DamageSimStats.format_ticks_to_time(stats.average) + ", " + \
               "Frequent: " + DamageSimStats.format_ticks_to_time(stats.most_frequent) + ", " + \
               "Max: " + DamageSimStats.format_ticks_to_time(stats.maximum) + ", " + \
               "Min: " + DamageSimStats.format_ticks_to_time(stats.minimum) + ", " + \
               "50%: " + DamageSimStats.format_ticks_to_time(stats.chance_to_kill)

        print(text)

    @staticmethod
    def print_stats(stats: SimStats, label: str):
        text = label + ": Average: " + str(round(stats.average, 4)) + ", " + \
               "Frequent: " + str(round(stats.most_frequent, 4)) + ", " + \
               "Max: " + str(round(stats.maximum, 4)) + ", " + \
               "Min: " + str(round(stats.minimum, 4))
        print(text)

    @staticmethod
    def format_ticks_to_time(ticks):
        total_seconds = round(ticks) * TICK_LENGTH
        minutes = math.floor(total_seconds / 60)
        seconds = round(total_seconds % 60, 1)

        seconds_str = ("0" + str(seconds))[-4:]
        return str(minutes) + ":" + seconds_str

    @staticmethod
    def get_cumulative_sum(data):
        bin_count = np.bincount(data) / len(data)
        return np.cumsum(bin_count)

    @staticmethod
    def print_setup(weapon_setups: list[Weapon], total_damage_stats: list[SimStats]):
        text = ""
        for idx, weapon in enumerate(weapon_setups):
            text += weapon.gear_setup.name
            text += ", Avg Total Damage: " + str(round(total_damage_stats[idx].average, 1))

            text += ", DPS: " + str(round(weapon.get_dps(), 4)) + "\n"

        print(text[:-1])

    @staticmethod
    def get_input_gear_setup_label(input_gear_setup: InputGearSetup) -> InputGearSetupLabels:
        gear_setup_settings_label = DamageSimStats.get_gear_setup_settings_label(input_gear_setup.gear_setup_settings)
        all_weapon_labels = DamageSimStats.get_all_weapons_label(input_gear_setup.all_weapons)

        input_gear_setup_label = ""
        if gear_setup_settings_label:
            input_gear_setup_label += gear_setup_settings_label + " -> "

        for weapon_label in all_weapon_labels:
            input_gear_setup_label += weapon_label + ", "

        return InputGearSetupLabels(input_gear_setup_label[:-2], gear_setup_settings_label, all_weapon_labels)

    @staticmethod
    def get_all_weapons_label(all_weapons: list[Weapon]) -> list[str]:
        weapon_labels = []
        for weapon in all_weapons:
            weapon_labels.append(DamageSimStats.get_weapon_label(weapon))
        return weapon_labels

    @staticmethod
    def get_weapon_label(weapon: Weapon) -> str:
        gear = weapon.gear_setup
        gear_setup_label = ""
        for prayer in gear.prayers:
            gear_setup_label += prayer.name.lower().capitalize().replace('_', ' ') + ", "

        if gear.is_special_attack:
            gear_setup_label += "Special, "

        if gear_setup_label:
            gear_setup_label = " (" + gear_setup_label[:-2] + ")"

        weapon_label = (gear.name or "unnamed") + gear_setup_label
        return weapon_label

    @staticmethod
    def get_gear_setup_settings_label(gear_setup_settings: GearSetupSettings) -> str:
        gear_setup_settings_label = ""
        combat_stats_text = DamageSimStats.get_combat_stats_label(gear_setup_settings.combat_stats)
        boost_text = DamageSimStats.get_boost_label(gear_setup_settings.boosts)
        stat_drain_text = DamageSimStats.get_stat_drain_label(gear_setup_settings.stat_drains)

        for text in [combat_stats_text, boost_text, stat_drain_text]:
            if text:
                gear_setup_settings_label += text + " | "

        return gear_setup_settings_label[:-2]

    @staticmethod
    def get_stat_drain_label(stat_drains: list[StatDrain]) -> str | None:
        stat_drain_text = ""
        for stat_drain in stat_drains:
            stat_drain_type_text = STAT_DRAIN_TYPE[stat_drain.weapon.stat_drain_type]
            if stat_drain.weapon.stat_drain_type == StatDrainType.HITS and stat_drain.value == 1:
                stat_drain_type_text = stat_drain_type_text[:-1]

            stat_drain_text += (STAT_DRAIN_NAME[stat_drain.weapon] + ": " + str(stat_drain.value) + " " +
                                stat_drain_type_text + ", ")

        if stat_drain_text:
            return "Stat drain - " + stat_drain_text[:-2]
        else:
            return "Stat drain - None"

    @staticmethod
    def get_boost_label(boosts: list[BoostType]) -> str | None:
        boost_text = ""
        for boost in boosts:
            boost_text += BOOST_NAME.get(boost, str(boost.name).replace('_', ' ').lower()) + ", "

        if boost_text:
            return "Boosts - " + boost_text[:-2]
        else:
            return "Boosts - None"

    @staticmethod
    def get_combat_stats_label(combat_stats: CombatStats) -> str | None:
        stats_text = ""

        if combat_stats.hitpoints != MAX_COMBAT_STATS:
            stats_text += "Hp: " + str(combat_stats.hitpoints) + ", "

        if combat_stats.attack != MAX_COMBAT_STATS:
            stats_text += "Att: " + str(combat_stats.attack) + ", "

        if combat_stats.strength != MAX_COMBAT_STATS:
            stats_text += "Str: " + str(combat_stats.strength) + ", "

        if combat_stats.defence != MAX_COMBAT_STATS:
            stats_text += "Def: " + str(combat_stats.defence) + ", "

        if combat_stats.magic != MAX_COMBAT_STATS:
            stats_text += "Magic: " + str(combat_stats.magic) + ", "

        if combat_stats.ranged != MAX_COMBAT_STATS:
            stats_text += "Ranged: " + str(combat_stats.ranged) + ", "

        if stats_text:
            return "Combat stats - " + stats_text[:-2]
        else:
            return "Combat stats - Max"

    @staticmethod
    def get_global_settings_label(global_settings: GlobalSettings):
        title = (DamageSimStats.get_npc_title(global_settings) +
                 " | HP: " +
                 str(global_settings.npc.base_combat_stats.hitpoints))

        if global_settings.raid_level:
            title += " | Raid level: " + str(global_settings.raid_level)
            if global_settings.path_level:
                title += ", Path level: " + str(global_settings.path_level)

        title += " | Iterations: " + f"{global_settings.iterations:,}"

        return title

    @staticmethod
    def get_dps_graph_label(global_settings: GlobalSettings):
        title = (DamageSimStats.get_npc_title(global_settings) +
                 " | HP: " +
                 str(global_settings.npc.base_combat_stats.hitpoints))

        if global_settings.raid_level:
            title += " | Raid level: " + str(global_settings.raid_level)
            if global_settings.path_level:
                title += ", Path level: " + str(global_settings.path_level)

        return title

    @staticmethod
    def get_npc_title(global_settings: GlobalSettings) -> str:
        npc = global_settings.npc
        npc_title = npc.name

        if global_settings.is_cox_challenge_mode:
            npc_title += " (CM)"
        elif npc.is_tob_hard_mode:
            npc_title += " Hard Mode"
        elif npc.is_tob_entry_mode:
            npc_title += " Entry Mode"

        return npc_title

    @staticmethod
    def get_damage_sim_result(sim_data: TotalDamageSimData, gear_setup_dps_stats: GearSetupDpsStats,
                              labels: InputGearSetupLabels) -> (DamageSimResult, SimStats):
        ttk_stats = DamageSimStats.get_data_stats(sim_data.ticks_to_kill)
        ttk_stats_ticks = DamageSimStats.get_ticks_stats(ttk_stats)
        total_damage_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_total_dmg)
        attack_count_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_attack_count)
        sim_dps_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_dps)
        cumulative_chances = list(DamageSimStats.get_cumulative_sum(sim_data.ticks_to_kill))

        damage_sim_result = DamageSimResult(
            labels=labels,
            theoretical_dps=gear_setup_dps_stats.theoretical_dps,
            max_hit=gear_setup_dps_stats.max_hit,
            accuracy=gear_setup_dps_stats.accuracy,
            ttk_stats=ttk_stats_ticks,
            total_damage_stats=total_damage_stats,
            attack_count_stats=attack_count_stats,
            sim_dps_stats=sim_dps_stats,
            cumulative_chances=cumulative_chances
        )
        return damage_sim_result, ttk_stats

    @staticmethod
    def get_min_and_max_ticks(ttk_stats: list[SimStats]):
        min_ticks = math.inf
        max_ticks = 0

        for ttk_stat in ttk_stats:
            min_ticks = min(min_ticks, ttk_stat.minimum)
            max_ticks = max(max_ticks, ttk_stat.maximum)

        return min_ticks, max_ticks

    @staticmethod
    def get_detailed_run(ticks_to_kill: list[int], total_tick_data: list[list[TickData]], npc: NpcStats, label
                         ) -> DetailedRun:
        np_ticks_to_kill = np.array(ticks_to_kill)

        index_max = np.argmax(np_ticks_to_kill)
        index_min = np.argmin(np_ticks_to_kill)
        index_frequent = np.where(np_ticks_to_kill == np.argmax(np.bincount(np_ticks_to_kill)))[0][0]

        tick_data_details = []
        for index in [index_min, index_frequent, index_max]:
            tick_data_list = total_tick_data[index]
            for tick_data in tick_data_list:
                tick_data.max_hits = DamageSimStats.to_list(tick_data.max_hits)
                tick_data.hitsplats = DamageSimStats.to_list(tick_data.hitsplats)
                tick_data.roll_hits = DamageSimStats.to_list(tick_data.roll_hits)

            tick_data_details.append(
                TickDataDetails(
                    time_to_kill=DamageSimStats.format_ticks_to_time(ticks_to_kill[index]),
                    tick_data=total_tick_data[index]
                )
            )

        return DetailedRun(
            input_gear_setup_label=label,
            npc_hp=npc.base_combat_stats.hitpoints,
            npc_defence=npc.base_combat_stats.defence,
            tick_data_details=tick_data_details
        )

    @staticmethod
    def to_list(variable):
        return [variable] if not isinstance(variable, list) else variable
