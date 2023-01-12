import math
import random

from bolt_special_attack import BoltSpecialAttack
from constants import TICK_LENGTH
from model.bolt import RubyBolts, DiamondBolts
from weapon import Weapon


class ZaryteCrossbow(Weapon):

    def update_special_bonus(self):
        super().update_special_bonus()
        if self.special_bolt:
            if isinstance(self.special_bolt, RubyBolts):
                self.special_bolt.effect_value = 0.22
            elif isinstance(self.special_bolt, DiamondBolts):
                self.special_bolt.effect_value = 0.25

    def roll_damage(self) -> int:
        if not self.is_special_attack or not self.special_bolt:
            return super().roll_damage()

        self.accuracy = self.get_accuracy()
        hit = random.random()

        if hit <= self.accuracy:
            return self.special_bolt.roll_damage(self.max_hit, self.npc.combat_stats.hitpoints)
        else:
            bolt_damage = BoltSpecialAttack.roll_damage(self.special_bolt, self.max_hit,
                                                        self.npc.combat_stats.hitpoints)
            if bolt_damage:
                return bolt_damage
            else:
                return 0

    def get_attack_roll(self):
        if self.is_special_attack:
            return 2 * super().get_attack_roll()
        else:
            return super().get_attack_roll()

    def get_dps(self):
        if not self.is_special_attack or not self.special_bolt:
            return super().get_dps()

        if isinstance(self.special_bolt, RubyBolts):
            spec_max_hit = math.floor(500 * self.special_bolt.effect_value)
            avg_dmg = self.accuracy * spec_max_hit + ((1 - self.accuracy) *
                                                      self.special_bolt.proc_chance * spec_max_hit)
            return avg_dmg / (self.attack_speed * TICK_LENGTH)

        elif isinstance(self.special_bolt, DiamondBolts):
            spec_max_hit = math.floor(self.max_hit * (1 + self.special_bolt.effect_value))
            avg_dmg = (self.accuracy * spec_max_hit * 0.5) + ((1 - self.accuracy) *
                                                              self.special_bolt.proc_chance * spec_max_hit * 0.5)
            return avg_dmg / (self.attack_speed * TICK_LENGTH)
