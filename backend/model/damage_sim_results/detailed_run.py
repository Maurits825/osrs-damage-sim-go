from dataclasses import dataclass

from model.damage_sim_results.tick_data import TickData


@dataclass()
class DetailedRun:
    time_to_kill: str
    tick_data: list[TickData]
