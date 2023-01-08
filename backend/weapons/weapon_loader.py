import copy

from model.weapon_stats import WeaponStats
from weapon import Weapon
from weapons.custom_weapons import CUSTOM_WEAPONS


class WeaponLoader:

    @staticmethod
    def load_weapon(weapon: WeaponStats) -> Weapon:
        if weapon.name in CUSTOM_WEAPONS:
            weapon = copy.deepcopy(CUSTOM_WEAPONS[weapon.name])
        else:
            weapon = Weapon()

        return weapon
