import math
import numpy as np
from dataclasses import dataclass

from constants import TOA_PATH_LEVEL_NPCS, TICK_LENGTH, MAX_X_TICKS_LABEL
from model.input_setup import GearSetup, InputSetup
from model.locations import Location

global matplotlib
global plt


@dataclass()
class TimeSimStats:
    average: str
    maximum: str
    minimum: str
    most_frequent: str

    chance_to_kill: list[str]

    label: str = None


@dataclass()
class SimStats:
    average: float
    maximum: int
    minimum: int
    most_frequent: int

    chance_to_kill: list

    label: str = None


class DamageSimStats:
    def __init__(self, show_plots):
        self.show_plots = show_plots

        global matplotlib
        matplotlib = __import__('matplotlib', globals(), locals())
        if not self.show_plots:
            matplotlib.use('Agg')

        global plt  # TODO consider making plt a class var?
        matplotlib = __import__('matplotlib.pyplot', globals(), locals())
        plt = matplotlib.pyplot

        self.figure = plt.figure(figsize=(19.20, 10.80))
        self.axes = self.figure.add_subplot()

    def reset_plots(self):
        plt.clf()
        if self.show_plots:
            plt.close()
        self.figure = plt.figure(figsize=(19.20, 10.80))
        self.axes = self.figure.add_subplot()

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
        return TimeSimStats(DamageSimStats.format_ticks_to_time(sim_stats.average),
                            DamageSimStats.format_ticks_to_time(sim_stats.maximum),
                            DamageSimStats.format_ticks_to_time(sim_stats.minimum),
                            DamageSimStats.format_ticks_to_time(sim_stats.most_frequent),
                            [DamageSimStats.format_ticks_to_time(chance) for chance in sim_stats.chance_to_kill],
                            sim_stats.label
                            )

    @staticmethod
    def get_data_2d_stats(data_list2d, gear_setups: list[GearSetup]) -> list[SimStats]:
        sim_stats_list = []
        data_list = []
        for index in range(len(data_list2d[0])):
            for data in data_list2d:
                data_list.append(data[index])
            sim_stats_list.append(DamageSimStats.get_data_stats(data_list, DamageSimStats.get_gear_label(gear_setups[index])))
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
    def graph_tick_counts(tick_count, weapon):
        bin_count = np.bincount(tick_count)
        plt.bar(np.arange(len(bin_count)), bin_count)
        plt.title(weapon.name)
        plt.show()

    @staticmethod
    def graph_cummulative_tick_count(tick_count, gear_setups: list[GearSetup]):
        cum_sum = DamageSimStats.get_cumulative_sum(tick_count)
        time_stamps = [DamageSimStats.format_ticks_to_time(tick) for tick in np.arange(len(cum_sum))]
        plt.plot(time_stamps, cum_sum)
        plt.xticks(np.arange(0, len(cum_sum) + 1, 20))  # TODO time labels are kind big so this need to be like 10+
        plt.title(DamageSimStats.get_gear_setup_label(gear_setups))
        plt.show()

    def graph_n_cumulative_tick_count(self, tick_count, gear_setups: list[GearSetup]):
        cum_sum = DamageSimStats.get_cumulative_sum(tick_count)
        time_stamps = [DamageSimStats.format_ticks_to_time(tick) for tick in np.arange(len(cum_sum))]
        self.axes.plot(time_stamps, cum_sum, label=DamageSimStats.get_gear_setup_label(gear_setups))

    @staticmethod
    def get_cumulative_sum(data): # TODO remove the first zero?
        bin_count = np.bincount(data) / len(data)
        return np.cumsum(bin_count)

    def show_cumulative_graph(self, min_ticks, max_ticks, input_setup: InputSetup, iterations, hitpoints):
        # TODO figure out how to get nice evenly space ticks
        # TODO maybe just try to set interval as 1,10,20 ticks with np.arange() until total timestamps are below 30
        # TODO xticks should also be multiples of ticks
        x_ticks, interval = DamageSimStats.get_x_ticks(min_ticks, max_ticks)
        self.axes.set_xticks(x_ticks)  # TODO time labels are kind big so this need to be like 10+
        self.axes.set_yticks(np.arange(0, 1.1, 0.1))

        # TODO figure out margins
        self.axes.set_xlim(max(min_ticks-interval, 0), max_ticks+interval)

        self.axes.set_xlabel("Time to kill")
        self.axes.set_ylabel("Cummulative chance")

        title = "Cumulative Time to Kill: "
        title += input_setup.npc.name + ", HP: " + str(hitpoints)

        if input_setup.npc.location == Location.TOMBS_OF_AMASCUT:
            title += ", raid level: " + str(input_setup.raid_level)
            if input_setup.npc.name in TOA_PATH_LEVEL_NPCS:
                title += ", path level: " + str(input_setup.path_level)

        title += ", iterations: " + str(iterations)

        self.axes.set_title(title)
        self.axes.legend()
        self.figure.tight_layout()
        self.axes.margins(x=0.02, y=0.04)
        self.axes.set_facecolor(color="lightgrey") #TODO maybe better colors
        self.axes.grid(linewidth=0.2, color="white")

        if self.show_plots:
            plt.show()

        return self.figure

    @staticmethod
    def get_x_ticks(min_ticks, max_ticks):
        interval_multiplier = 1
        while True:
            interval = TICK_LENGTH * interval_multiplier
            label_count = (max_ticks - min_ticks) / interval

            if label_count <= MAX_X_TICKS_LABEL:
                return [min_ticks + (i * interval) for i in range(math.ceil(label_count))], interval
            else:
                interval_multiplier += 1

    @staticmethod
    def print_setup(gear_setup: list[GearSetup], total_damage_stats: list[SimStats]):
        text = ""
        for idx, gear in enumerate(gear_setup):
            text += gear.name + ": " + str(gear.attack_count)
            text += ", Avg Total Damage: " + str(round(total_damage_stats[idx].average, 1))

            text += ", DPS: " + str(round(gear.weapon.get_dps(), 4)) + "\n"

        print(text[:-1])

    @staticmethod
    def get_gear_setup_label(gear_setups: list[GearSetup]):
        label = ""
        for gear in gear_setups:
            label += DamageSimStats.get_gear_label(gear) + ", "
        return label[:-2]

    @staticmethod
    def get_gear_label(gear: GearSetup):
        label = ""
        prayer_and_boost_text = ""
        for prayer in gear.prayers:
            prayer_and_boost_text += prayer.name.lower().capitalize() + ", "

        for boost in gear.boosts:
            prayer_and_boost_text += boost.boost_type.name.lower().replace("_", " ").capitalize() + ", "

        if prayer_and_boost_text:
            prayer_and_boost_text = " (" + prayer_and_boost_text[:-2] + ")"

        label = label + gear.name + prayer_and_boost_text + ": " + str(gear.attack_count)
        return label

