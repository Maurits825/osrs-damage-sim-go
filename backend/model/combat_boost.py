from dataclasses import dataclass


@dataclass()
class DpsBoost:
    attack_boost: float = 1
    strength_boost: float = 1


@dataclass()
class CombatBoost:
    melee: DpsBoost = DpsBoost()
    ranged: DpsBoost = DpsBoost()
    magic: DpsBoost = DpsBoost()
