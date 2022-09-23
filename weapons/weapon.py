from dataclasses import dataclass
import random
import math


@dataclass()
class Weapon:
    max_hit: int
    accuracy: float
    attack_speed: int
    attack_count: int = math.inf
    name: str = 'weapon'

    def roll_damage(self, health=0) -> int:
        hit = random.random()
        damage = 0
        if hit <= (self.accuracy / 100.0):
            damage = random.randint(0, self.max_hit)

        return damage
