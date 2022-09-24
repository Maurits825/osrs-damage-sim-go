import math
import numpy as np
import matplotlib.pyplot as plt
from dataclasses import dataclass

from model.input_setup import GearSetup


@dataclass()
class SimStats:
    average: int
    maximum: int
    minimum: int
    most_frequent: int


class DamageSimStats:
    @staticmethod
    def get_tick_count_stats(tick_count) -> SimStats:
        np_counts = np.array(tick_count)
        average = np.average(np_counts)
        maximum = np.max(np_counts)
        minimum = np.min(np_counts)
        frequent = int(np.argmax(np.bincount(np_counts)))

        return SimStats(average, maximum, minimum, frequent)

    @staticmethod
    def print_stats(stats: SimStats):
        print("Average: " + DamageSimStats.format_ticks_to_time(stats.average) + ", " +
              "Frequent: " + DamageSimStats.format_ticks_to_time(stats.most_frequent) + ", " +
              "Max: " + DamageSimStats.format_ticks_to_time(stats.maximum) + ", " +
              "Min: " + DamageSimStats.format_ticks_to_time(stats.minimum))

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
    def print_setup(gear_setup: [GearSetup]):
        text = ""
        for gear in gear_setup:
            text = text + gear.name + ": " + str(gear.attack_count) + ", DPS: " + str(gear.weapon.get_dps())

        print(text[:-2])
