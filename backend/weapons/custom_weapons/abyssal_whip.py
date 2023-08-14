import math

from weapons.weapon import Weapon


class AbyssalWhip(Weapon):
    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return math.floor(super().get_attack_roll() * 1.25)
        else:
            return super().get_attack_roll()
