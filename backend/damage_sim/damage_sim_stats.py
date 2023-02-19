import math
import numpy as np

from constants import TICK_LENGTH
from model.boost import BoostType
from model.damage_sim_results import TotalDamageSimData, DamageSimResults
from model.input_setup.input_gear_setup import InputGearSetup
from model.input_setup.input_setup import InputSetup
from model.sim_stats import SimStats, TimeSimStats
from weapon import Weapon

BOOST_NAME = {
    BoostType.SMELLING_SALTS: "Salt",
    BoostType.SUPER_ATTACK: "Super att",
    BoostType.SUPER_STRENGTH: "Super str",
    BoostType.SUPER_COMBAT: "SCP",
    BoostType.RANGING: "Ranged",
    BoostType.LIQUID_ADRENALINE: "Adrenaline",
    BoostType.OVERLOAD_PLUS: "Overload+",
}


class DamageSimStats:
    @staticmethod
    def get_data_stats(data, label: str) -> SimStats:
        np_data = np.array(data)
        average = np.average(np_data)
        maximum = np.max(np_data)
        minimum = np.min(np_data)

        cumulative_sum = DamageSimStats.get_cumulative_sum(data)
        chance_to_kill = [
            int(np.argmax(cumulative_sum >= 0.25)),
            int(np.argmax(cumulative_sum >= 0.50)),
            int(np.argmax(cumulative_sum >= 0.75))
        ]

        try:
            frequent = int(np.argmax(np.bincount(np_data)))
        except TypeError:
            frequent = 0

        return SimStats(float(average), int(maximum), int(minimum), int(frequent), list(chance_to_kill), label)

    @staticmethod
    def get_ticks_stats(sim_stats: SimStats) -> TimeSimStats:
        return TimeSimStats(
            DamageSimStats.format_ticks_to_time(sim_stats.average),
            DamageSimStats.format_ticks_to_time(sim_stats.maximum),
            DamageSimStats.format_ticks_to_time(sim_stats.minimum),
            DamageSimStats.format_ticks_to_time(sim_stats.most_frequent),
            [DamageSimStats.format_ticks_to_time(chance) for chance in sim_stats.chance_to_kill],
            sim_stats.label
        )

    @staticmethod
    def get_data_2d_stats(data_list2d, input_gear_setup: InputGearSetup) -> list[SimStats]:
        sim_stats_list = []
        data_list = []
        for index in range(len(data_list2d[0])):
            for data in data_list2d:
                data_list.append(data[index])

            sim_stats_list.append(DamageSimStats.get_data_stats(
                data_list,
                DamageSimStats.get_weapon_label(input_gear_setup.weapons[index], input_gear_setup))
            )
            data_list.clear()
        return sim_stats_list

    @staticmethod
    def print_ticks_stats(stats: SimStats, label: str):
        text = label + ": Average: " + DamageSimStats.format_ticks_to_time(stats.average) + ", " + \
               "Frequent: " + DamageSimStats.format_ticks_to_time(stats.most_frequent) + ", " + \
               "Max: " + DamageSimStats.format_ticks_to_time(stats.maximum) + ", " + \
               "Min: " + DamageSimStats.format_ticks_to_time(stats.minimum) + ", " + \
               "25%: " + DamageSimStats.format_ticks_to_time(stats.chance_to_kill[0]) + ", " + \
               "50%: " + DamageSimStats.format_ticks_to_time(stats.chance_to_kill[1]) + ", " + \
               "75%: " + DamageSimStats.format_ticks_to_time(stats.chance_to_kill[2])

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
        total_seconds = ticks * TICK_LENGTH
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
    def get_input_gear_setup_label(input_gear_setup: InputGearSetup):
        label = ""
        for weapon in input_gear_setup.weapons:
            label += DamageSimStats.get_weapon_label(weapon, input_gear_setup) + ", "
        return label[:-2]

    @staticmethod
    def get_weapon_label(weapon: Weapon, input_gear_setup: InputGearSetup):
        label = ""
        gear = weapon.gear_setup
        prayer_and_boost_text = ""
        for prayer in gear.prayers:
            prayer_and_boost_text += prayer.name.lower().capitalize() + ", "

        for boost in input_gear_setup.gear_setup_settings.boosts:
            prayer_and_boost_text += BOOST_NAME.get(boost, str(boost.name).replace('_', ' ').lower()) + ", "

        if prayer_and_boost_text:
            prayer_and_boost_text = " (" + prayer_and_boost_text[:-2] + ")"

        label = label + gear.name + prayer_and_boost_text
        return label

    @staticmethod
    def get_graph_title_info(input_setup: InputSetup):
        title = (input_setup.global_settings.npc.name +
                 ", HP: " +
                 str(input_setup.global_settings.npc.combat_stats.hitpoints))

        if input_setup.global_settings.raid_level:
            title += ", raid level: " + str(input_setup.global_settings.raid_level)
            if input_setup.global_settings.path_level:
                title += ", path level: " + str(input_setup.global_settings.path_level)

        title += ", iterations: " + str(input_setup.global_settings.iterations)

        return title

    @staticmethod
    def populate_damage_sim_stats(damage_sim_results: DamageSimResults, sim_data: TotalDamageSimData,
                                  input_gear_setup: InputGearSetup) -> SimStats:
        ttk_stats = DamageSimStats.get_data_stats(
            sim_data.ticks_to_kill, DamageSimStats.get_input_gear_setup_label(input_gear_setup)
        )
        damage_sim_results.ttk_stats.append(DamageSimStats.get_ticks_stats(ttk_stats))

        sim_dps_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_dps, input_gear_setup)
        damage_sim_results.sim_dps_stats.append(sim_dps_stats)

        total_damage_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_total_dmg, input_gear_setup)
        damage_sim_results.total_damage_stats.append(total_damage_stats)

        attack_count_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_attack_count, input_gear_setup)
        damage_sim_results.attack_count_stats.append(attack_count_stats)

        damage_sim_results.cumulative_chances.append(list(DamageSimStats.get_cumulative_sum(sim_data.ticks_to_kill)))

        return ttk_stats

    @staticmethod
    def get_min_and_max_ticks(ttk_stats: list[SimStats]):
        min_ticks = math.inf
        max_ticks = 0

        for ttk_stat in ttk_stats:
            min_ticks = min(min_ticks, ttk_stat.minimum)
            max_ticks = max(max_ticks, ttk_stat.maximum)

        return min_ticks, max_ticks
