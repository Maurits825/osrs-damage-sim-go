from enum import Enum
from dataclasses import dataclass


@dataclass()
class Multiplier:
    attack: float = 0
    strength: float = 0

    ranged: float = 0
    ranged_strength: float = 0


class Prayer(Enum):
    PIETY = Multiplier(attack=1.20, strength=1.23)
    CHIVALRY = Multiplier(attack=1.15, strength=1.18)
    RIGOUR = Multiplier(ranged=1.20, ranged_strength=1.23)
    EAGLE_EYE = Multiplier(ranged=1.15, ranged_strength=1.15)
