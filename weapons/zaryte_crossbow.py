import math
import random

from dps_calculator import DpsCalculator
from model.npc_stats import NpcStats
from weapon import Weapon


class ZaryteCrossbow(Weapon):
    name: str = 'ZCB spec'

    def roll_damage(self, current_hitpoints, npc: NpcStats) -> int:
        if not self.is_special_attack:
            return super().roll_damage(current_hitpoints, npc)

        self.accuracy = self.get_accuracy(npc)
        hit = random.random()
        damage = 0
        if hit <= self.accuracy:
            damage = min(110, math.floor(0.22*current_hitpoints))

        return damage

    def get_attack_roll(self):
        if self.is_special_attack:
            return 2 * super().get_attack_roll()
        else:
            return super().get_attack_roll()

    def get_dps(self):
        if self.is_special_attack:
            return 0
        else:
            return DpsCalculator.get_dps(self.max_hit, self.accuracy, self.attack_speed)
