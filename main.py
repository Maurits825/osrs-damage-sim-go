import math
from dataclasses import dataclass

import numpy as np
import click
import matplotlib.pyplot as plt

from weapons.fang import Fang
from weapons.scythe import Scythe
from weapons.weapon import Weapon
from boss_setups import boss_setups


@dataclass()
class Stats:
    average: int
    maximum: int
    minimum: int
    most_frequent: int


class DamageSimulator:
    def __init__(self):
        pass

    def simulate_once(self, weapons: [Weapon], health) -> int:
        attack_count = -1
        current_weapon_att_count = 0
        weapons_index = 0
        weapon = weapons[weapons_index]

        while health > 0:
            if current_weapon_att_count >= weapon.attack_count:
                weapons_index += 1
                weapon = weapons[weapons_index]
            damage = weapon.roll_damage(health)
            health -= damage

            attack_count += 1
            current_weapon_att_count += 1

        return attack_count * weapon.attack_speed

    def simulate(self, weapons: [Weapon], health, iterations) -> []:
        tick_count = []
        for i in range(iterations):
            tick_count.append(self.simulate_once(weapons, health))

        return tick_count

    def get_tick_count_stats(self, tick_count):
        np_counts = np.array(tick_count)
        average = np.average(np_counts)
        maximum = np.max(np_counts)
        minimum = np.min(np_counts)
        frequent = int(np.argmax(np.bincount(np_counts)))

        return Stats(average, maximum, minimum, frequent)

    def print_stats(self, stats: Stats):
        print("Average: " + self.format_ticks_to_time(stats.average) + ", " +
              "Frequent: " + self.format_ticks_to_time(stats.most_frequent) + ", " +
              "Max: " + self.format_ticks_to_time(stats.maximum) + ", " +
              "Min: " + self.format_ticks_to_time(stats.minimum))

    def format_ticks_to_time(self, ticks):
        total_seconds = ticks * 0.6
        minutes = math.floor(total_seconds / 60)
        seconds = round(total_seconds % 60, 1)

        return str(minutes) + ":" + str(seconds)

    def graph_tick_counts(self, tick_count, weapon):
        bin_count = np.bincount(tick_count)
        plt.bar(np.arange(len(bin_count)), bin_count)
        plt.title(weapon.name)
        plt.show()

    def print_setup(self, weapons: [Weapon]):
        text = ""
        for weapon in weapons:
            text = text + weapon.name + ": " + str(weapon.attack_count) + ", "

        print(text[:-2])

    def run(self, weapons: [Weapon], health, iterations):
        tick_counts = self.simulate(weapons, health, iterations)
        stats = self.get_tick_count_stats(tick_counts)
        self.print_setup(weapons)
        self.print_stats(stats)
        self.graph_tick_counts(tick_counts, weapons[-1])


@click.command()
def main():
    damage_simulator = DamageSimulator()
    health = boss_setups["Kephri"]["Health"]
    iterations = 100000

    weapons = boss_setups["Kephri"]["Scythe crush"]
    damage_simulator.run(weapons, health, iterations)

    weapons = boss_setups["Kephri"]["Rapier"]
    damage_simulator.run(weapons, health, iterations)


if __name__ == '__main__':
    main()
