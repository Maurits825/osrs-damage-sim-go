from dataclasses import dataclass

from model.damage_sim_results.detailed_run import DetailedRun
from model.graph import GraphType
from model.sim_stats import TimeSimStats, SimStats


@dataclass()
class GearSetupDpsStats:
    theoretical_dps: list[float]
    max_hit: list[int]
    accuracy: list[float]


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
class InputGearSetupLabels:
    input_gear_setup_label: str
    gear_setup_settings_label: str
    all_weapon_labels: list[str]


@dataclass()
class DamageSimResult:
    labels: InputGearSetupLabels

    ttk_stats: TimeSimStats
    total_damage_stats: list[SimStats]
    attack_count_stats: list[SimStats]
    sim_dps_stats: list[SimStats]
    cumulative_chances: list[float]

    theoretical_dps: list[float]
    max_hit: list[int]
    accuracy: list[float]


@dataclass()
class DamageSimResults:
    results: list[DamageSimResult]
    detailed_runs: list[list[DetailedRun]]
    global_settings_label: str
    graphs: dict[GraphType, str]
