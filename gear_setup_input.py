import math
import re

from gear_json import GearJson
from model.attack_style import AttackStyle
from model.input_setup import GearSetup
from model.prayer import Prayer
from model.weapon_stats import WeaponStats
from weapon import Weapon
from weapons.bandos_godsword import BandosGodsword
from weapons.dragon_claws import DragonClaws
from weapons.twisted_bow import TwistedBow
from weapons.zaryte_crossbow import ZaryteCrossbow
from wiki_data import WikiData

CUSTOM_WEAPONS = {
    "Dragon claws": DragonClaws(),
    "Zaryte crossbow": ZaryteCrossbow(),
    "Twisted bow": TwistedBow(),
    "Bandos godsword": BandosGodsword(),
}


class GearSetupInput:
    @staticmethod
    def load_gear_setup(name: str, attack_style_name: str,
                        prayers: [Prayer] = None, attacks: int = math.inf, is_special=False) -> GearSetup:
        gear_dict = GearJson.load_gear()
        gear = gear_dict[name]

        total_gear_stats = WeaponStats(name=name)
        weapon = None
        for gear_id in gear:
            weapon_stats = WikiData.get_item(gear_id)
            total_gear_stats += weapon_stats

            # TODO this could be moved higher up like in damage_sim.py?
            if weapon_stats.weapon_category:
                attack_style: AttackStyle = weapon_stats.weapon_category.value[0]
                for style in weapon_stats.weapon_category.value:
                    if re.match(attack_style_name + " \\(", style.name):
                        attack_style = style

                if weapon_stats.name in CUSTOM_WEAPONS:
                    weapon = CUSTOM_WEAPONS[weapon_stats.name]
                else:
                    weapon = Weapon()

                weapon.set_attack_style_and_speed(attack_style, weapon_stats.attack_speed)

                if is_special:
                    weapon.set_is_special_attack(is_special)

        return GearSetup(name=name,
                         gear_stats=total_gear_stats,
                         weapon=weapon,
                         attack_count=attacks,
                         prayers=prayers)
