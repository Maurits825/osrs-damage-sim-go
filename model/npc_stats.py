from dataclasses import dataclass

from model.aggressive_stats import AggressiveStats
from model.combat_stats import CombatStats
from model.defensive_stats import DefensiveStats


@dataclass()
class NpcStats:
    name: str

    combat_stats: CombatStats
    aggressive_stats: AggressiveStats
    defensive_stats: DefensiveStats
