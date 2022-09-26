import copy
import math
import re

from gear_json import GearJson
from model.attack_style.attack_style import AttackStyle
from model.input_setup import GearSetup
from model.prayer import Prayer
from model.weapon_stats import WeaponStats
from weapon import Weapon
from weapons.bandos_godsword import BandosGodsword
from weapons.bone_dagger import BoneDagger
from weapons.dragon_claws import DragonClaws
from weapons.dragon_warhammer import DragonWarhammer
from weapons.fang import Fang
from weapons.twisted_bow import TwistedBow
from weapons.zaryte_crossbow import ZaryteCrossbow
from wiki_data import WikiData

#TODO is this the place?
CUSTOM_WEAPONS = {
    "Dragon claws": DragonClaws(),
    "Zaryte crossbow": ZaryteCrossbow(),
    "Twisted bow": TwistedBow(),
    "Bandos godsword": BandosGodsword(),
    "Bone dagger": BoneDagger(),
    "Osmumten's fang": Fang(),
    "Dragon warhammer": DragonWarhammer(),
}

VOID = {8839, 8840, 8842}
ELITE_VOID = {13072, 13073, 8842}
MELEE_VOID = 11665
MAGE_VOID = 11663
RANGED_VOID = 11664


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
                    weapon = copy.deepcopy(CUSTOM_WEAPONS[weapon_stats.name])
                else:
                    weapon = Weapon()

                weapon.set_attack_style_and_speed(attack_style, weapon_stats.attack_speed)
                void_att, void_str = GearSetupInput.get_gear_void_bonuses(gear)
                weapon.set_void_boost(void_att, void_str)

                if is_special:
                    weapon.set_is_special_attack(is_special)

        return GearSetup(name=name,
                         gear_stats=total_gear_stats,
                         weapon=weapon,
                         attack_count=attacks,
                         prayers=prayers)

    @staticmethod
    def get_gear_void_bonuses(gear):
        void_att = 1
        void_str = 1
        # TODO mage void
        if VOID.issubset(gear) or ELITE_VOID.issubset(gear):
            if MELEE_VOID in gear:
                void_att = 1.1
                void_str = 1.1

            if ELITE_VOID.issubset(gear):
                if RANGED_VOID in gear:
                    void_att = 1.1
                    void_str = 1.125
            else:
                void_att = 1.1
                void_str = 1.1

        return void_att, void_str

