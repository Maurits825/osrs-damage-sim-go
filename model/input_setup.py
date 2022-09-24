from dataclasses import dataclass

from weapon import Weapon
from model.boost import Boost
from model.combat_stats import CombatStats
from model.npc_stats import NpcStats
from model.prayer import Prayer
from model.weapon_stats import WeaponStats


@dataclass()
class GearSetup:
    name: str
    gear_stats: WeaponStats  # total bonus of gear + weapon, including att speed i guess
    weapon: Weapon  # class that we can inherit and do custom dmg stuff
    attack_count: int  # TODO is this the right place?


@dataclass()
class InputSetup:
    npc: NpcStats
    combat_stats: CombatStats
    gear_setups: [GearSetup]

    boosts: [Boost]
    prayers: [Prayer]

    raid_level: int = None
    path_level: int = None
