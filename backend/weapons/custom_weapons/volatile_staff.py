import math

from weapons.dps_calculator import DpsCalculator
from weapons.weapon import Weapon


class VolatileStaff(Weapon):
    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return math.floor(super().get_attack_roll() * 1.5)
        else:
            return super().get_attack_roll()

    def get_magic_base_hit(self):
        if not self.gear_setup.is_special_attack:
            return super().get_magic_base_hit()

        return math.floor(1 + (58 / 99 * min(98, self.combat_stats.magic)))

    def get_magic_max_hit(self):
        if not self.gear_setup.is_special_attack:
            return super().get_magic_max_hit()

        base_max_hit = self.get_magic_base_hit()

        magic_dmg_multiplier = self.gear_setup.gear_stats.magic_strength / 100
        magic_dmg_multiplier += self.void_bonus.magic.strength_boost[-1]

        max_hit = DpsCalculator.apply_gear_bonus(base_max_hit, self.special_gear_bonus.magic.strength_boost)
        max_hit = math.floor(max_hit * magic_dmg_multiplier)

        return max_hit
