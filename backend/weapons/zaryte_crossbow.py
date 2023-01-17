import math

from bolt_special_attack import BoltSpecialAttack
from constants import TICK_LENGTH
from model.bolt import RubyBolts, DiamondBolts
from model.gear_setup import GearSetup
from model.npc.npc_stats import NpcStats
from weapon import Weapon


class ZaryteCrossbow(Weapon):
    def __init__(self, gear_setup: GearSetup, npc: NpcStats, raid_level, special_attack_cost):
        super().__init__(gear_setup, npc, raid_level, special_attack_cost)
        if self.special_bolt:
            if isinstance(self.special_bolt, RubyBolts):
                self.special_bolt.effect_value = 0.22
            elif isinstance(self.special_bolt, DiamondBolts):
                self.special_bolt.effect_value = 0.25

    def roll_damage(self) -> int:
        if not self.gear_setup.is_special_attack or not self.special_bolt:
            return super().roll_damage()

        if self.roll_hit():
            return self.special_bolt.roll_damage(self.max_hit, self.npc.combat_stats.hitpoints)
        else:
            bolt_damage = BoltSpecialAttack.roll_damage(self.special_bolt, self.max_hit,
                                                        self.npc.combat_stats.hitpoints)
            if bolt_damage:
                return bolt_damage
            else:
                return 0

    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return 2 * super().get_attack_roll()
        else:
            return super().get_attack_roll()

    def get_dps(self):
        self.accuracy = self.get_accuracy()

        if not self.gear_setup.is_special_attack or not self.special_bolt:
            return super().get_dps()

        if isinstance(self.special_bolt, RubyBolts):
            spec_max_hit = math.floor(500 * self.special_bolt.effect_value)
            avg_dmg = self.accuracy * spec_max_hit + ((1 - self.accuracy) *
                                                      self.special_bolt.proc_chance * spec_max_hit)
            return avg_dmg / (self.gear_setup.gear_stats.attack_speed * TICK_LENGTH)

        elif isinstance(self.special_bolt, DiamondBolts):
            spec_max_hit = math.floor(self.max_hit * (1 + self.special_bolt.effect_value))
            avg_dmg = (self.accuracy * spec_max_hit * 0.5) + ((1 - self.accuracy) *
                                                              self.special_bolt.proc_chance * spec_max_hit * 0.5)
            return avg_dmg / (self.gear_setup.gear_stats.attack_speed * TICK_LENGTH)
