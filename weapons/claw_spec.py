import math
from dataclasses import dataclass

from weapons.weapon import Weapon
import random


@dataclass()
class ClawSpec(Weapon):
    name: str = 'Dragon claws spec'

    def roll_damage(self, health=0) -> int:
        hit = random.random()

        if hit <= (self.accuracy / 100.0):
            hit1 = random.randint(math.floor(self.max_hit / 2), self.max_hit - 1)
            hit2 = math.floor(hit1 / 2)
            hit3 = math.floor(hit2 / 2)
            hit4 = hit3 + round(random.random())
        else:
            hit = random.random()
            if hit <= (self.accuracy / 100.0):
                hit1 = 0
                hit2 = random.randint(math.floor(self.max_hit * (3/8)), math.floor(self.max_hit * (7/8)))
                hit3 = math.floor(hit2 / 2)
                hit4 = hit3 + round(random.random())
            else:
                hit = random.random()
                if hit <= (self.accuracy / 100.0):
                    hit1 = 0
                    hit2 = 0
                    hit3 = random.randint(math.floor(self.max_hit * (1/4)), math.floor(self.max_hit * (3/4)))
                    hit4 = hit3 + round(random.random())
                else:
                    hit = random.random()
                    if hit <= (self.accuracy / 100.0):
                        hit1 = 0
                        hit2 = 0
                        hit3 = 0
                        hit4 = random.randint(math.floor(self.max_hit * 0.25), math.floor(self.max_hit * 1.25))
                    else:
                        hit1 = 0
                        hit2 = 0
                        hit3 = random.randint(0, 1)
                        hit4 = hit3

        return hit1 + hit2 + hit3 + hit4
