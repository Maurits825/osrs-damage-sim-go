import math
from dataclasses import dataclass

from weapons.weapon import Weapon
import random


@dataclass()
class ZcbSpec(Weapon):
    name: str = 'ZCB spec'

    def roll_damage(self, health=0) -> int:
        hit = random.random()
        damage = 0
        if hit <= (self.accuracy / 100.0):
            damage = min(self.max_hit, math.floor(0.22*health))

        return damage
