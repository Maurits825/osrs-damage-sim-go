from dataclasses import dataclass

from matplotlib.figure import Figure

from model.sim_stats import TimeSimStats, SimStats


@dataclass()
class SingleDamageSimData:
    ticks_to_kill: int
    gear_total_dmg: list[int]
    gear_attack_count: list[int]
    gear_dps: list[float]


@dataclass()
class TotalDamageSimData:
    ticks_to_kill: list[int]
    gear_total_dmg: list[list[int]]
    gear_attack_count: list[list[int]]
    gear_dps: list[list[float]]


@dataclass()
class DamageSimResults:
    ttk_stats_list: list[TimeSimStats]
    total_damage_stats_list: list[list[SimStats]]
    attack_count_stats_list: list[list[SimStats]]
    sim_dps_stats_list: list[list[SimStats]]
    theoretical_dps_list: list[list[float]]
    cumulative_chances_list: list[list[float]]
    max_hit: list[list[int]]
    accuracy: list[list[float]]
    figure: Figure | None
