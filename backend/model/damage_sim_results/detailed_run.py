from dataclasses import dataclass

from model.damage_sim_results.tick_data import TickData


@dataclass()
class TickDataDetails:
    time_to_kill: str
    tick_data: list[TickData]


@dataclass()
class DetailedRun:
    input_gear_setup_label: str
    tick_data_details: list[TickDataDetails]
