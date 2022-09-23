from dataclasses import dataclass
import math
import random
from weapons.weapon import Weapon


@dataclass()
class Fang(Weapon):
    name: str = 'Fang'

    def __post_init__(self):
        self.true_min_hit = math.floor(self.max_hit * 0.15)
        self.true_max_hit = self.max_hit - math.floor(self.max_hit * 0.15)

    def roll_damage(self, health=0) -> int:
        hit = random.random()
        damage = 0
        if hit <= (self.accuracy / 100.0):
            damage = random.randint(self.true_min_hit, self.true_max_hit)
        else:
            hit = random.random()
            if hit <= (self.accuracy / 100.0):
                damage = random.randint(self.true_min_hit, self.true_max_hit)

        return damage
