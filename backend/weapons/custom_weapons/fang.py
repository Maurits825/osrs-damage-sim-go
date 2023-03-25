import math
import random

from model.gear_setup import GearSetup
from model.npc.combat_stats import CombatStats
from model.npc.npc_stats import NpcStats
from weapons.dps_calculator import DpsCalculator
from weapons.weapon import Weapon


class Fang(Weapon):
    def __init__(self, gear_setup: GearSetup, combat_stats: CombatStats, npc: NpcStats, raid_level):
        super().__init__(gear_setup, combat_stats, npc, raid_level)

        self.true_min_hit = 0

    def roll_hit(self) -> bool:
        max_defence_roll = self.get_defence_roll()
        attack_roll = int(random.random() * (self.attack_roll + 1))
        defence_roll = int(random.random() * (max_defence_roll + 1))

        if attack_roll > defence_roll:
            return True

        if self.raid_level:
            attack_roll = int(random.random() * (self.attack_roll + 1))
            defence_roll = int(random.random() * (max_defence_roll + 1))
            return attack_roll > defence_roll
        else:
            attack_roll = int(random.random() * (self.attack_roll + 1))
            return attack_roll > defence_roll

    def roll_damage(self) -> int:
        damage = 0
        max_hit = self.max_hit

        if self.roll_hit():
            damage = int((random.random() * (max_hit - self.true_min_hit + 1)) + self.true_min_hit)

        return damage

    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return math.floor(1.5 * super().get_attack_roll())
        else:
            return super().get_attack_roll()

    def get_dps(self):
        accuracy = self.get_accuracy()
        max_hit = super().get_max_hit()

        if self.gear_setup.is_special_attack:
            max_hit += self.get_true_min_hit()

        return DpsCalculator.get_dps(max_hit, accuracy, self.gear_setup.gear_stats.attack_speed)

    def get_max_hit(self):
        max_hit = super().get_max_hit()
        self.true_min_hit = self.get_true_min_hit()

        if self.gear_setup.is_special_attack:
            return max_hit
        else:
            return max_hit - math.floor(max_hit * 0.15)

    def get_accuracy(self):
        accuracy = super().get_accuracy()
        attack_roll = self.get_attack_roll()

        if self.raid_level:
            effective_accuracy = accuracy + ((1 - accuracy) * accuracy)
        else:
            defence_roll = self.get_defence_roll()
            if attack_roll >= defence_roll:
                effective_accuracy = 1 - (((defence_roll + 2) * (2 * defence_roll + 3)) /
                                          (6 * math.pow(attack_roll + 1, 2)))
            else:
                effective_accuracy = ((attack_roll * (4 * attack_roll + 5)) /
                                      (6 * (attack_roll + 1) * (defence_roll + 1)))

        return effective_accuracy

    def get_true_min_hit(self):
        return math.floor(super().get_max_hit() * 0.15)
