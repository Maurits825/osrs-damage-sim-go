from __future__ import annotations

import random

from weapons.dps_calculator import DpsCalculator
from weapons.weapon import Weapon

SPEC_MIN_HIT = 75
SPEC_MAX_HIT = 150


class Dawnbringer(Weapon):
    def roll_hit(self) -> bool:
        return True

    def get_accuracy(self):
        return 1

    def get_max_hit(self) -> int | list[int]:
        if not self.gear_setup.is_special_attack:
            return super().get_max_hit()
        return SPEC_MAX_HIT

    def roll_damage(self):
        if not self.gear_setup.is_special_attack:
            return super().roll_damage()

        damage = int((random.random() * (SPEC_MAX_HIT - SPEC_MIN_HIT + 1)) + SPEC_MIN_HIT)

        self.hitsplat.set_hitsplat(damage=damage, hitsplats=damage, roll_hits=True,
                                   accuracy=self.accuracy, max_hits=self.max_hit, special_proc=None)

    def get_dps(self):
        if not self.gear_setup.is_special_attack:
            return super().get_dps()

        return DpsCalculator.get_dps(SPEC_MIN_HIT + SPEC_MAX_HIT, self.accuracy, self.gear_setup.gear_stats.attack_speed)
