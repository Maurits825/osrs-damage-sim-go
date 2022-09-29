from dataclasses import dataclass


@dataclass()
class CombatStats:
    hitpoints: int
    attack: int
    strength: int
    defence: int
    magic: int
    ranged: int
