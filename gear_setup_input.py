import math
import re

from gear_json import GearJson
from model.attack_style import AttackStyle
from model.input_setup import GearSetup
from model.prayer import Prayer
from model.weapon_stats import WeaponStats
from weapon import Weapon
from wiki_data import WikiData


class GearSetupInput:
    @staticmethod
    def load_gear_setup(name: str, attack_style_name: str, prayers: [Prayer] = None, attacks: int = math.inf) -> GearSetup:
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
                weapon = Weapon(attack_style, weapon_stats.attack_speed)


        # todo if weapon is in a custom weapon dict or something,
        # grab the custom class or something
        return GearSetup(name=name,
                         gear_stats=total_gear_stats,
                         weapon=weapon,
                         attack_count=attacks,
                         prayers=prayers)
