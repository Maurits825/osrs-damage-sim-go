import math

from constant import TICK_LENGTH
from weapons.bolt_special_attack import BoltSpecialAttack


class RubyBolts(BoltSpecialAttack):
    def __init__(self):
        self.proc_chance = 0.06
        self.effect_value = 0.2

    def roll_damage(self, max_hit, hp):
        max_hit = self.special_max_hit(max_hit, hp)
        return max_hit, max_hit

    def special_max_hit(self, max_hit, hp) -> int:
        return int(min(500 * self.effect_value, math.floor(hp * self.effect_value)))

    def get_dps(self, accuracy, max_hit, attack_speed, hp) -> float:
        spec_max_hit = self.special_max_hit(max_hit, hp)
        return ((spec_max_hit * self.proc_chance) +
                ((1 - self.proc_chance) * accuracy * max_hit * 0.5)) / (attack_speed * TICK_LENGTH)
