import math
import random

from constant import TICK_LENGTH
from weapons.bolt_special_attack import BoltSpecialAttack


class DiamondBolts(BoltSpecialAttack):
    def __init__(self):
        self.base_proc_chance = 0.1
        self.proc_chance = self.base_proc_chance
        self.effect_value = 0.15

    def roll_damage(self, max_hit, hp):
        max_hit = self.special_max_hit(max_hit, hp)
        return int(random.random() * (max_hit + 1)), max_hit

    def special_max_hit(self, max_hit, hp) -> int:
        return math.floor(max_hit * (1 + self.effect_value))

    def get_dps(self, accuracy, max_hit, attack_speed, hp) -> float:
        spec_max_hit = self.special_max_hit(max_hit, hp)
        return ((spec_max_hit * self.proc_chance * 0.5) +
                ((1 - self.proc_chance) * accuracy * max_hit * 0.5)) / (attack_speed * TICK_LENGTH)
