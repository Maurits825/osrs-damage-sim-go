import math
import random

from constants import RUBY_SPEC_DIARY_CHANCE
from weapon import Weapon

ZCB_RUBY_MAX_HIT = 110


class ZaryteCrossbow(Weapon):
    def roll_damage(self) -> int:
        if not self.is_special_attack:
            return super().roll_damage()

        self.accuracy = self.get_accuracy()
        hit = random.random()
        damage = 0
        if hit <= self.accuracy:
            damage = min(ZCB_RUBY_MAX_HIT, math.floor(0.22 * self.npc.combat_stats.hitpoints))
        else:
            # TODO figure out how to properly hande bolts
            ruby = random.random()
            if ruby <= RUBY_SPEC_DIARY_CHANCE:
                damage = min(ZCB_RUBY_MAX_HIT, math.floor(0.22 * self.npc.combat_stats.hitpoints))

        return damage

    def get_attack_roll(self):
        if self.is_special_attack:
            return 2 * super().get_attack_roll()
        else:
            return super().get_attack_roll()

    def get_dps(self):
        if self.is_special_attack:
            self.accuracy = self.get_accuracy()
            return ((ZCB_RUBY_MAX_HIT * self.accuracy) +
                    ((1 - self.accuracy) * RUBY_SPEC_DIARY_CHANCE * ZCB_RUBY_MAX_HIT)) / (self.attack_speed * 0.6)
        else:
            return super().get_dps()
