from dataclasses import dataclass

from model.damage_sim_results.dps_graph_data import DpsGraphData


@dataclass()
class DpsGrapherResults:
    graph: str
    graph_data: DpsGraphData
