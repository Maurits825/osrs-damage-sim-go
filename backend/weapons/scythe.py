import math
import random

from dps_calculator import DpsCalculator
from weapon import Weapon


class Scythe(Weapon):
    def roll_damage(self) -> int:
        self.accuracy = self.get_accuracy()
        return self.roll_single_hit(1) + self.roll_single_hit(0.5) + self.roll_single_hit(0.25)

    def roll_single_hit(self, reduction) -> int:
        hit = random.random()
        damage = 0
        if hit <= self.accuracy:
            damage = random.randint(0, self.max_hit)

        return math.floor(damage * reduction)

    def get_dps(self):
        self.accuracy = self.get_accuracy()
        effective_max_hit = self.max_hit + self.max_hit * 0.5 + self.max_hit * 0.25
        return DpsCalculator.get_dps(effective_max_hit, self.accuracy, self.attack_speed)
