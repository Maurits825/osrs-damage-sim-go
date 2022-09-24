from gear_json import GearJson
from model.input_setup import GearSetup
from model.weapon_stats import WeaponStats
from weapon import Weapon
from wiki_data import WikiData


class GearSetupInput:
    @staticmethod
    def load_gear_setup(name: str, attacks: int = 0) -> GearSetup:
        gear_dict = GearJson.load_gear()
        gear = gear_dict[name]

        total_gear_stats = WeaponStats(name=name)
        weapon = None
        for gear_id in gear:
            weapon_stats = WikiData.get_item(gear_id)
            total_gear_stats += weapon_stats

            if weapon_stats.weapon_category:
                weapon = Weapon(weapon_stats.weapon_category)

        # todo if weapon is in a custom weapon dict or something,
        # grab the custom class or something
        return GearSetup(name=name,
                         gear_stats=total_gear_stats,
                         weapon=weapon,
                         attack_count=attacks)


g = GearSetupInput()
g.load_gear_setup("Max rapier", 5)
