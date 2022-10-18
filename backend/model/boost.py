import math
from enum import Enum

from model.npc.combat_stats import CombatStats


class BoostType(Enum):
    SMELLING_SALTS = 1
    SUPER_ATTACK_POT = 2
    SUPER_STRENGTH_POT = 3
    SUPER_DEFENCE_POT = 4
    SUPER_COMBAT_POT = 5
    RANGED_POT = 6


class Boost:
    def __init__(self, boost_type: BoostType):
        self.boost_type = boost_type

    def apply_boost(self, combat_stats: CombatStats):
        if self.boost_type == BoostType.SMELLING_SALTS:
            combat_stats.attack += math.floor(combat_stats.attack * 16/100) + 11
            combat_stats.strength += math.floor(combat_stats.strength * 16 / 100) + 11
            combat_stats.defence += math.floor(combat_stats.defence * 16 / 100) + 11
            combat_stats.ranged += math.floor(combat_stats.ranged * 16 / 100) + 11
            combat_stats.magic += math.floor(combat_stats.magic * 16 / 100) + 11
        elif self.boost_type == BoostType.SUPER_ATTACK_POT:
            combat_stats.attack += math.floor(combat_stats.attack * 15 / 100) + 5
        elif self.boost_type == BoostType.SUPER_STRENGTH_POT:
            combat_stats.strength += math.floor(combat_stats.strength * 15 / 100) + 5
        elif self.boost_type == BoostType.SUPER_DEFENCE_POT:
            combat_stats.defence += math.floor(combat_stats.defence * 15 / 100) + 5
        elif self.boost_type == BoostType.SUPER_COMBAT_POT:
            combat_stats.attack += math.floor(combat_stats.attack * 15 / 100) + 5
            combat_stats.strength += math.floor(combat_stats.strength * 15 / 100) + 5
            combat_stats.defence += math.floor(combat_stats.defence * 15 / 100) + 5
        elif self.boost_type == BoostType.RANGED_POT:
            combat_stats.ranged += math.floor(combat_stats.ranged * 1 / 10) + 4
