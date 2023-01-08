import math
import random

from constants import TICK_LENGTH
from weapon import Weapon

DOUBLE_DMG_CHANCE = 0.05
AVG_DMG_BOOST = 1.2875  # from wiki


class Gadderhammer(Weapon):
    def roll_damage(self) -> int:
        self.accuracy = self.get_accuracy()
        hit = random.random()
        damage = 0
        if hit <= self.accuracy:
            damage = random.randint(0, self.max_hit)

        double_hit = random.random()
        if double_hit <= DOUBLE_DMG_CHANCE:
            return math.floor(damage * 2 * self.damage_multiplier)  # TODO is base dmg x2 or after its floored?
        else:
            return math.floor(damage * self.damage_multiplier)

    def get_dps(self):
        self.accuracy = self.get_accuracy()
        avg_dmg = sum([math.floor(dmg * AVG_DMG_BOOST) for dmg in range(self.max_hit + 1)]) / (self.max_hit + 1)
        return (avg_dmg * self.accuracy) / (self.attack_speed * TICK_LENGTH)
