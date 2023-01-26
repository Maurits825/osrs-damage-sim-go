import math
import numpy as np

from constants import TOA_PATH_LEVEL_NPCS, MAX_X_TICKS_LABEL
from damage_sim.damage_sim_stats import DamageSimStats
from model.input_setup import InputSetup
from model.locations import Location
from weapon import Weapon

global matplotlib


# TODO also have a graph of the ttk stats?
class DamageSimGraph:
    def __init__(self, show_plots):
        self.show_plots = show_plots

        global matplotlib
        matplotlib = __import__('matplotlib', globals(), locals())
        if not self.show_plots:
            matplotlib.use('Agg')

        matplotlib = __import__('matplotlib.pyplot', globals(), locals())
        self.plt = matplotlib.pyplot

        self.figure = self.plt.figure(figsize=(19.20, 10.80))
        self.axes = self.figure.add_subplot()

    def reset_plots(self):
        self.plt.clf()
        if self.show_plots:
            self.plt.close()
        self.figure = self.plt.figure(figsize=(19.20, 10.80))
        self.axes = self.figure.add_subplot()

    def graph_tick_counts(self, tick_count, weapon):
        bin_count = np.bincount(tick_count)
        self.plt.bar(np.arange(len(bin_count)), bin_count)
        self.plt.title(weapon.name)
        self.plt.show()

    # TODO graphing a line graph is not correct, but it looks better than a scatter graph
    def graph_n_cumulative_tick_count(self, tick_count, weapon_setups: list[Weapon]):
        cum_sum = DamageSimStats.get_cumulative_sum(tick_count)
        time_stamps = [DamageSimStats.format_ticks_to_time(tick) for tick in np.arange(len(cum_sum))]
        self.axes.plot(time_stamps, cum_sum, label=DamageSimStats.get_weapon_setup_label(weapon_setups))

    def get_cumulative_graph_figure(self, min_ticks, max_ticks, input_setup: InputSetup, iterations, hitpoints):
        x_ticks, interval = DamageSimGraph.get_x_ticks(min_ticks, max_ticks)
        self.axes.set_xticks(x_ticks)
        self.axes.set_yticks(np.arange(0, 1.1, 0.1))

        self.axes.set_xlim(max(min_ticks-interval, 0), x_ticks[-1])

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
        self.axes.set_facecolor(color="lightgrey")
        self.axes.grid(linewidth=0.2, color="white")

        if self.show_plots:
            self.plt.show()

        return self.figure

    @staticmethod
    def get_x_ticks(min_ticks, max_ticks):
        interval = 1
        while True:
            label_count = (max_ticks - min_ticks) / interval

            if label_count <= MAX_X_TICKS_LABEL:
                return [min_ticks + (i * interval) for i in range(math.ceil(label_count) + 1)], interval
            else:
                interval += 1
