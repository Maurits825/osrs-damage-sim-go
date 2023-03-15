from dataclasses import dataclass
from enum import Enum


@dataclass()
class CombatStyleBoost:
    attack: int = 0
    strength: int = 0
    ranged: int = 0
    magic: int = 0
    name: str = None


class CombatStyle(Enum):
    ACCURATE = CombatStyleBoost(attack=3, ranged=3, magic=2)
    AGGRESSIVE = CombatStyleBoost(strength=3)
    CONTROLLED = CombatStyleBoost(attack=1, strength=1)
    RAPID = CombatStyleBoost()
    DEFENSIVE = CombatStyleBoost()
    LONGRANGE = CombatStyleBoost()
    AUTOCAST = CombatStyleBoost()

    def __init__(self, boost):
        boost.name = self.name
