import math
import random

from weapons.dps_calculator import DpsCalculator
from weapons.weapon import Weapon


HITSPLAT_2_REDUCTION = 0.5
HITSPLAT_3_REDUCTION = 0.25


class Scythe(Weapon):
    def roll_damage(self) -> list[int]:
        hitsplats = [self.roll_single_hit(1)]

        if self.npc.size > 1:
            hitsplats.append(self.roll_single_hit(HITSPLAT_2_REDUCTION))
        if self.npc.size > 2:
            hitsplats.append(self.roll_single_hit(HITSPLAT_3_REDUCTION))

        return hitsplats

    def roll_single_hit(self, reduction) -> int:
        damage = 0
        if self.roll_hit():
            damage = int(random.random() * (self.max_hit[0] + 1))

        return math.floor(damage * reduction)

    def get_dps(self):
        accuracy = self.get_accuracy()
        max_hit = self.get_max_hit()

        effective_max_hit = max_hit[0]
        if self.npc.size > 1:
            effective_max_hit += max_hit[1]
        if self.npc.size > 2:
            effective_max_hit += max_hit[2]

        return DpsCalculator.get_dps(effective_max_hit, accuracy, self.gear_setup.gear_stats.attack_speed)

    def get_max_hit(self) -> list[int]:
        base_max_hit = super().get_max_hit()

        return [
            base_max_hit,
            math.floor(base_max_hit * HITSPLAT_2_REDUCTION),
            math.floor(base_max_hit * HITSPLAT_3_REDUCTION),
        ]
