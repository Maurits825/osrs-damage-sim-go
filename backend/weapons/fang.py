import math
import random

from dps_calculator import DpsCalculator
from weapon import Weapon


class Fang(Weapon):
    def __init__(self):
        super().__init__()
        self.true_min_hit = 0
        self.true_max_hit = 0

    def update_max_hit(self):
        super().update_max_hit()

        self.true_min_hit = math.floor(self.max_hit * 0.15)
        self.true_max_hit = self.max_hit - math.floor(self.max_hit * 0.15)

    def roll_damage(self) -> int:
        damage = 0

        if self.is_special_attack:
            max_hit = self.max_hit
        else:
            max_hit = self.true_max_hit

        if self.roll_hit():
            damage = random.randint(self.true_min_hit, max_hit)
        else:
            if self.roll_hit():
                damage = random.randint(self.true_min_hit, max_hit)

        return damage

    def get_attack_roll(self):
        if self.is_special_attack:
            return math.floor(1.5 * super().get_attack_roll())
        else:
            return super().get_attack_roll()

    def get_dps(self):
        self.accuracy = self.get_accuracy()
        effective_accuracy = self.accuracy + ((1 - self.accuracy) * self.accuracy)

        if self.is_special_attack:
            max_hit = self.max_hit
        else:
            max_hit = self.true_max_hit

        effective_max_hit = self.true_min_hit + max_hit
        return DpsCalculator.get_dps(effective_max_hit, effective_accuracy, self.attack_speed)
