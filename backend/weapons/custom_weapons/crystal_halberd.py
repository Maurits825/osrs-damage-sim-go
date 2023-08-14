from __future__ import annotations

import math
import random

from constant import TICK_LENGTH
from weapons.dps_calculator import DpsCalculator
from weapons.weapon import Weapon

SECOND_HIT_ACCURACY_MULTIPLIER = 0.75


class CrystalHalberd(Weapon):
    def get_base_max_hit(self):
        if self.gear_setup.is_special_attack:
            # TODO should be [max, max][0:npc.size] but weapon.roll_damage expects max_hit to be a int, not list
            return math.floor(super().get_base_max_hit() * 1.1)
        else:
            return super().get_base_max_hit()

    def get_npc_defence_and_style(self):
        if not self.gear_setup.is_special_attack:
            return super().get_npc_defence_and_style()

        target_defence = self.npc.combat_stats.defence
        target_defence_style = self.npc.defensive_stats.slash
        return target_defence, target_defence_style

    def roll_damage(self):
        super().roll_damage()

        if self.gear_setup.is_special_attack and self.npc.size > 1:
            damage = 0
            roll_hit = self.roll_hit_reduced()
            if roll_hit:
                damage = int(random.random() * (self.max_hit + 1))

            self.hitsplat.hitsplats = [self.hitsplat.hitsplats, damage]
            self.hitsplat.roll_hits = [self.hitsplat.roll_hits, roll_hit]
            self.hitsplat.damage = sum(self.hitsplat.hitsplats)

    def roll_hit_reduced(self) -> bool:
        attack_roll = int(random.random() * (math.floor(self.attack_roll * SECOND_HIT_ACCURACY_MULTIPLIER) + 1))
        defence_roll = int(random.random() * (self.get_defence_roll() + 1))

        return attack_roll > defence_roll

    def get_dps(self):
        dps = super().get_dps()
        second_hit_dps = 0
        if self.gear_setup.is_special_attack and self.npc.size > 1:
            attack_roll = math.floor(self.attack_roll * SECOND_HIT_ACCURACY_MULTIPLIER)
            defence_roll = self.get_average_defence_roll()

            accuracy = DpsCalculator.get_hit_chance(attack_roll, defence_roll)
            total_average_damage = self.get_average_damage(self.max_hit)
            second_hit_dps = (total_average_damage * accuracy) / (self.gear_setup.gear_stats.attack_speed * TICK_LENGTH)

        return dps + second_hit_dps
