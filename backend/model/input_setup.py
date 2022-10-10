from dataclasses import dataclass

from weapon import Weapon
from model.boost import Boost
from model.npc.combat_stats import CombatStats
from model.npc.npc_stats import NpcStats
from model.prayer import Prayer
from model.weapon_stats import WeaponStats


@dataclass()
class GearSetup:
    name: str
    gear_stats: WeaponStats
    weapon: Weapon
    attack_count: int
    prayers: list[Prayer]
    combat_stats: CombatStats
    boosts: list[Boost]


@dataclass()
class InputSetup:
    npc: NpcStats
    gear_setups: list[list[GearSetup]]

    raid_level: int = None
    path_level: int = None
