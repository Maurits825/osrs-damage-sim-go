from model.gear_setup import GearSetup
from model.npc.npc_stats import NpcStats
from weapon import Weapon
from weapons.custom_weapons import CUSTOM_WEAPONS


class WeaponLoader:

    @staticmethod
    def load_weapon(weapon_name, gear_setup: GearSetup,
                    npc: NpcStats, raid_level, special_attack_cost) -> Weapon:
        if weapon_name in CUSTOM_WEAPONS:
            weapon = CUSTOM_WEAPONS[weapon_name](gear_setup, npc, raid_level, special_attack_cost)
        else:
            weapon = Weapon(gear_setup, npc, raid_level, special_attack_cost)

        return weapon
