from enum import Enum
from dataclasses import dataclass


@dataclass()
class CombatStyleBoost:
    attack: float = 0
    strength: float = 0
    ranged: float = 0


class CombatStyle(Enum):
    ACCURATE = CombatStyleBoost(attack=3, ranged=3)
    AGGRESSIVE = CombatStyleBoost(strength=3)
    DEFENSIVE = CombatStyleBoost()
    CONTROLLED = CombatStyleBoost(attack=1, strength=1)
    LONGRANGE = CombatStyleBoost()
    RAPID = CombatStyleBoost()
    AUTOCAST = CombatStyleBoost()
