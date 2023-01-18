from dataclasses import dataclass


@dataclass()
class CombatStats:
    hitpoints: int
    attack: int
    strength: int
    defence: int
    magic: int
    ranged: int

    def set_stats(self, combat_stats):
        self.hitpoints = combat_stats.hitpoints
        self.attack = combat_stats.attack
        self.strength = combat_stats.strength
        self.defence = combat_stats.defence
        self.magic = combat_stats.magic
        self.ranged = combat_stats.ranged
