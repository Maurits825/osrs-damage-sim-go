import base64
import io
import math

import matplotlib
import matplotlib.pyplot as plt
import numpy as np

from damage_sim.damage_sim_stats import DamageSimStats
from model.damage_sim_results.dps_graph_data import DpsGraphData
from model.graph import Graph, GraphType
from model.input_setup.input_setup import InputSetup

GRAPH_WIDTH = 19.20
GRAPH_HEIGHT = 10.80

MAX_X_TICKS_LABEL = 30


class DamageSimGraph:
    def __init__(self):
        matplotlib.use('Agg')

        self.plt = plt
        self.plt.set_loglevel('WARNING')

        self.graphs = {
            GraphType.TTK_CUMULATIVE: Graph(self.plt, GRAPH_WIDTH, GRAPH_HEIGHT),
            GraphType.TTK_PROBABILITY: Graph(self.plt, GRAPH_WIDTH, GRAPH_HEIGHT),
            GraphType.DPS_GRAPH: Graph(self.plt, GRAPH_WIDTH, GRAPH_HEIGHT)
        }

    def get_dmg_sim_graphs(self, min_ticks, max_ticks, label, input_setup: InputSetup,
                           ttk_list: list[list[int]]) -> dict[GraphType, str]:
        self.reset_plots()
        self.generate_ttk_probability_figure(min_ticks, max_ticks, label, input_setup, ttk_list)
        self.generate_cumulative_figure(min_ticks, max_ticks, label, input_setup, ttk_list)

        graphs = {}
        for graph_type in [GraphType.TTK_CUMULATIVE, GraphType.TTK_PROBABILITY]:
            graphs[graph_type] = DamageSimGraph.encode_graph(self.graphs[graph_type])

        return graphs

    def get_dps_graphs(self, input_value_range, dps_graph_data: DpsGraphData) -> str:
        self.reset_plots()
        self.generate_dps_graph(input_value_range, dps_graph_data)
        graph = DamageSimGraph.encode_graph(self.graphs[GraphType.DPS_GRAPH])
        return graph

    def reset_plots(self):
        for graph in self.graphs.values():
            graph.reset()

    def generate_ttk_probability_figure(self, min_ticks, max_ticks, label,
                                        input_setup: InputSetup, ttk_list: list[list[int]]):
        bins = np.histogram_bin_edges(np.array(ttk_list).flatten(), bins="auto") # TODO bins should be discrete?
        x_list = []
        y_list = []
        max_bin_count = 0
        for index, ttk in enumerate(ttk_list):
            histogram, _ = np.histogram(ttk, bins)

            x_bins = bins[:-1][histogram > 0]
            x_list.append(x_bins)
            max_bin_count = max(max_bin_count, x_bins.size)
            y_list.append(histogram[histogram > 0] * (x_bins.size / input_setup.global_settings.iterations))

        y_list = [100 * (y / max_bin_count) for y in y_list]

        graph = self.graphs[GraphType.TTK_PROBABILITY]
        for i, input_gear_setup in enumerate(input_setup.input_gear_setups):
            graph.axes.plot(x_list[i], y_list[i], label=label[i])

        x_ticks, interval = DamageSimGraph.get_x_ticks(min_ticks, max_ticks)
        graph.axes.set_xticks(x_ticks[:-1])
        graph.axes.set_xticklabels(
            [DamageSimStats.format_ticks_to_time(tick) for tick in x_ticks[:-1]]
        )
        graph.axes.set_xlim(max(min_ticks - interval, 0), x_ticks[-1])

        graph.axes.set_xlabel("Time to kill")
        graph.axes.set_ylabel("Probability %")

        title = "Time to Kill Count: "
        title += DamageSimStats.get_global_settings_label(input_setup.global_settings)

        DamageSimGraph.format_figure(graph, title)

    def generate_cumulative_figure(self, min_ticks, max_ticks, label,
                                   input_setup: InputSetup, ttk_list: list[list[int]]):
        graph = self.graphs[GraphType.TTK_CUMULATIVE]
        for index, ttk in enumerate(ttk_list):
            cum_sum = DamageSimStats.get_cumulative_sum(ttk)
            time_stamps = [DamageSimStats.format_ticks_to_time(tick) for tick in np.arange(len(cum_sum))]
            graph.axes.plot(time_stamps, cum_sum, label=label[index])
        x_ticks, interval = DamageSimGraph.get_x_ticks(min_ticks, max_ticks)
        graph.axes.set_xticks(x_ticks)
        graph.axes.set_yticks(np.arange(0, 1.1, 0.1))

        graph.axes.set_xlim(max(min_ticks - interval, 0), x_ticks[-1])

        graph.axes.set_xlabel("Time to kill")
        graph.axes.set_ylabel("Cumulative chance")

        title = "Cumulative Time to Kill: "
        title += DamageSimStats.get_global_settings_label(input_setup.global_settings)

        DamageSimGraph.format_figure(graph, title)

    def generate_dps_graph(self, input_value_range, dps_graph_data: DpsGraphData):
        graph = self.graphs[GraphType.DPS_GRAPH]
        for dps_data in dps_graph_data.dps_data:
            graph.axes.plot(input_value_range, dps_data.dps, label=dps_data.label)

        graph.axes.set_xlabel(dps_graph_data.x_label)
        graph.axes.set_ylabel("Dps")

        DamageSimGraph.format_figure(graph, dps_graph_data.title)

    @staticmethod
    def encode_graph(graph: Graph) -> str:
        img = io.BytesIO()
        graph.figure.savefig(img, dpi=100)
        img.seek(0)

        encoded_graph = base64.b64encode(img.getvalue()).decode()
        return encoded_graph

    @staticmethod
    def format_figure(graph: Graph, title):
        graph.axes.set_title(title)
        graph.axes.legend()
        graph.figure.tight_layout()
        graph.axes.margins(x=0.02, y=0.04)
        graph.axes.set_facecolor(color="lightgrey")
        graph.axes.grid(linewidth=0.2, color="white")

    @staticmethod
    def get_x_ticks(min_ticks, max_ticks):
        interval = 1
        while True:
            label_count = (max_ticks - min_ticks) / interval

            if label_count <= MAX_X_TICKS_LABEL:
                return [min_ticks + (i * interval) for i in range(math.ceil(label_count) + 1)], interval
            else:
                interval += 1
