from __future__ import annotations

from model.gear_setup import GearSetup
from model.input_setup.gear_setup_settings import GearSetupSettings
from model.npc.npc_stats import NpcStats
from weapons.custom_weapon import CUSTOM_WEAPONS
from weapons.weapon import Weapon


class WeaponLoader:
    @staticmethod
    def load_weapon(weapon_name, gear_setup: GearSetup, gear_setup_settings: GearSetupSettings,
                    npc: NpcStats, raid_level) -> Weapon:
        for custom_weapon_name in CUSTOM_WEAPONS:
            if custom_weapon_name.lower() in weapon_name.lower():
                weapon = CUSTOM_WEAPONS[custom_weapon_name](
                    gear_setup, gear_setup_settings.combat_stats, npc, raid_level
                )
                break
        else:
            weapon = Weapon(gear_setup, gear_setup_settings.combat_stats, npc, raid_level)

        return weapon
