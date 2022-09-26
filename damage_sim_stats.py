import math

import numpy as np
import matplotlib.pyplot as plt
from dataclasses import dataclass

from model.input_setup import GearSetup, InputSetup


@dataclass()
class SimStats:
    average: int
    maximum: int
    minimum: int
    most_frequent: int


class DamageSimStats:
    @staticmethod
    def get_data_stats(data) -> SimStats:
        np_data = np.array(data)
        average = np.average(np_data)
        maximum = np.max(np_data)
        minimum = np.min(np_data)

        try:
            frequent = int(np.argmax(np.bincount(np_data)))
        except TypeError:
            frequent = 0

        return SimStats(average, maximum, minimum, frequent)

    @staticmethod
    def get_data_2d_stats(data_list) -> list[SimStats]:
        sim_stats_list = []
        dps = []
        for index in range(len(data_list[0])):
            for data in data_list:
                dps.append(data[index])
            sim_stats_list.append(DamageSimStats.get_data_stats(dps))
            dps.clear()
        return sim_stats_list

    @staticmethod
    def print_ticks_stats(stats: SimStats, label: str):
        print(label + ": Average: " + DamageSimStats.format_ticks_to_time(stats.average) + ", " +
              "Frequent: " + DamageSimStats.format_ticks_to_time(stats.most_frequent) + ", " +
              "Max: " + DamageSimStats.format_ticks_to_time(stats.maximum) + ", " +
              "Min: " + DamageSimStats.format_ticks_to_time(stats.minimum))

    @staticmethod
    def print_stats(stats: SimStats, label: str):
        print(label + ": Average: " + str(round(stats.average, 4)) + ", " +
              "Frequent: " + str(round(stats.most_frequent, 4)) + ", " +
              "Max: " + str(round(stats.maximum, 4)) + ", " +
              "Min: " + str(round(stats.minimum, 4)))

    @staticmethod
    def format_ticks_to_time(ticks):
        total_seconds = ticks * 0.6
        minutes = math.floor(total_seconds / 60)
        seconds = round(total_seconds % 60, 1)

        return str(minutes) + ":" + str(seconds)

    @staticmethod
    def graph_tick_counts(tick_count, weapon):
        bin_count = np.bincount(tick_count)
        plt.bar(np.arange(len(bin_count)), bin_count)
        plt.title(weapon.name)
        plt.show()

    @staticmethod
    def graph_cummulative_tick_count(tick_count, gear_setups: list[GearSetup]):
        bin_count = np.bincount(tick_count) / len(tick_count)
        cum_sum = np.cumsum(bin_count)
        time_stamps = [DamageSimStats.format_ticks_to_time(tick) for tick in np.arange(len(cum_sum))]
        plt.plot(time_stamps, cum_sum)
        plt.xticks(np.arange(0, len(cum_sum) + 1, 20))  # TODO time labels are kind big so this need to be like 10+
        plt.title(DamageSimStats.get_gear_setup_label(gear_setups))
        plt.show()

    @staticmethod
    def graph_n_cumulative_tick_count(tick_count, gear_setups: list[GearSetup]):
        bin_count = np.bincount(tick_count) / len(tick_count)
        cum_sum = np.cumsum(bin_count)
        time_stamps = [DamageSimStats.format_ticks_to_time(tick) for tick in np.arange(len(cum_sum))]
        plt.plot(time_stamps, cum_sum, label=DamageSimStats.get_gear_setup_label(gear_setups))

    @staticmethod
    def show_cumulative_graph(max_ticks, input_setup: InputSetup, iterations, hitpoints):
        plt.xticks(np.arange(0, max_ticks, 20))  # TODO time labels are kind big so this need to be like 10+
        plt.yticks(np.arange(0, 1.1, 0.1))

        plt.xlabel("Time to kill")
        plt.ylabel("Cummulative chance")

        title = "Cumulative Time to Kill: "
        title += input_setup.npc.name + ", HP: " + str(hitpoints)

        if input_setup.raid_level is not None:
            title += ", raid level: " + str(input_setup.raid_level)
        if input_setup.path_level is not None:
            title += ", path level: " + str(input_setup.path_level)

        title += ", iterations: " + str(iterations)

        plt.title(title)
        plt.legend()
        plt.show()

    @staticmethod
    def print_setup(gear_setup: list[GearSetup], sim_dps_stats: list[SimStats]):
        text = ""
        for idx, gear in enumerate(gear_setup):
            text += gear.name + ": " + str(gear.attack_count)
            if gear.attack_count != math.inf:
                text += ", Avg Damage: " + str(round(gear.attack_count * sim_dps_stats[idx].average * 0.6 * gear.weapon.attack_speed)) + "\n"
            else:
                text += ", DPS: " + str(round(gear.weapon.get_dps(), 4)) + "\n"

        print(text[:-1])

    @staticmethod
    def get_gear_setup_label(gear_setups: list[GearSetup]):
        info = ""
        for gear in gear_setups:
            info = info + gear.name + ": " + str(gear.attack_count) + ", "
        return info[:-2]
