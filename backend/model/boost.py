import math
from copy import deepcopy
from enum import Enum

from model.npc.combat_stats import CombatStats


class BoostType(Enum):
    SMELLING_SALTS = 1
    SUPER_ATTACK_POT = 2
    SUPER_STRENGTH_POT = 3
    SUPER_DEFENCE_POT = 4
    SUPER_COMBAT_POT = 5
    RANGED_POT = 6
    LIQUID_ADRENALINE = 7
    OVERLOAD_PLUS = 8


class Boost:
    @staticmethod
    def apply_boost(boost_type, combat_stats: CombatStats):
        if boost_type == BoostType.SMELLING_SALTS:
            combat_stats.attack += math.floor(combat_stats.attack * 16/100) + 11
            combat_stats.strength += math.floor(combat_stats.strength * 16 / 100) + 11
            combat_stats.defence += math.floor(combat_stats.defence * 16 / 100) + 11
            combat_stats.ranged += math.floor(combat_stats.ranged * 16 / 100) + 11
            combat_stats.magic += math.floor(combat_stats.magic * 16 / 100) + 11
        elif boost_type == BoostType.OVERLOAD_PLUS:
            combat_stats.attack += math.floor(combat_stats.attack * 16 / 100) + 6
            combat_stats.strength += math.floor(combat_stats.strength * 16 / 100) + 6
            combat_stats.defence += math.floor(combat_stats.defence * 16 / 100) + 6
            combat_stats.ranged += math.floor(combat_stats.ranged * 16 / 100) + 6
            combat_stats.magic += math.floor(combat_stats.magic * 16 / 100) + 6
        elif boost_type == BoostType.SUPER_ATTACK_POT:
            combat_stats.attack += math.floor(combat_stats.attack * 15 / 100) + 5
        elif boost_type == BoostType.SUPER_STRENGTH_POT:
            combat_stats.strength += math.floor(combat_stats.strength * 15 / 100) + 5
        elif boost_type == BoostType.SUPER_DEFENCE_POT:
            combat_stats.defence += math.floor(combat_stats.defence * 15 / 100) + 5
        elif boost_type == BoostType.SUPER_COMBAT_POT:
            combat_stats.attack += math.floor(combat_stats.attack * 15 / 100) + 5
            combat_stats.strength += math.floor(combat_stats.strength * 15 / 100) + 5
            combat_stats.defence += math.floor(combat_stats.defence * 15 / 100) + 5
        elif boost_type == BoostType.RANGED_POT:
            combat_stats.ranged += math.floor(combat_stats.ranged * 1 / 10) + 4

    @staticmethod
    def apply_boosts(initial_combat_stats: CombatStats, boosts: list[BoostType]):
        boosted_combat_stats = deepcopy(initial_combat_stats)
        for boost in boosts:
            combat_stats = deepcopy(initial_combat_stats)
            Boost.apply_boost(boost, combat_stats)
            boosted_combat_stats.merge_stats(combat_stats)

        return boosted_combat_stats
