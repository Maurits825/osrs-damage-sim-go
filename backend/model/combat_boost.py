from dataclasses import dataclass, field


@dataclass()
class DpsBoost:
    attack_boost: list[float] = field(default_factory=list)
    strength_boost: list[float] = field(default_factory=list)


@dataclass()
class CombatBoost:
    melee: DpsBoost = DpsBoost()
    ranged: DpsBoost = DpsBoost()
    magic: DpsBoost = DpsBoost()
