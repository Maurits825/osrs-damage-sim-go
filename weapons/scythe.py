import math
from dataclasses import dataclass

from weapons.weapon import Weapon
import random


@dataclass()
class Scythe(Weapon):
    name: str = 'Scythe'

    def roll_damage(self, health=0) -> int:
        return self.roll_single_hit(1) + self.roll_single_hit(0.5) + self.roll_single_hit(0.25)

    def roll_single_hit(self, reduction) -> int:
        hit = random.random()
        damage = 0
        if hit <= (self.accuracy / 100.0):
            damage = random.randint(0, self.max_hit)

        return math.floor(damage*reduction)
