import math
from dataclasses import dataclass

from model.npc.aggressive_stats import AggressiveStats
from model.npc.combat_stats import CombatStats
from model.npc.defensive_stats import DefensiveStats
from model.locations import Location


@dataclass()
class NpcStats:
    name: str

    combat_stats: CombatStats
    aggressive_stats: AggressiveStats
    defensive_stats: DefensiveStats

    location: Location
    size: int

    min_defence: int = 0

    is_kalphite: bool = False
    is_demon: bool = False
    is_dragon: bool = False
    is_undead: bool = False
    is_vampyre1: bool = False
    is_vampyre2: bool = False
    is_vampyre3: bool = False
    is_leafy: bool = False
    is_xerician: bool = False
    is_challenge_mode: bool = False
    is_shade: bool = False
    is_tob_entry_mode: bool = False
    is_tob_normal_mode: bool = False
    is_tob_hard_mode: bool = False

    def drain_defence(self, amount):
        self.combat_stats.defence = max(self.min_defence, self.combat_stats.defence - amount)

    def drain_defence_percent(self, percent):
        self.combat_stats.defence = max(self.min_defence, math.ceil(self.combat_stats.defence * (percent / 100)))
