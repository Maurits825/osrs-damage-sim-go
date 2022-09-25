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
    gear_stats: WeaponStats
    weapon: Weapon
    attack_count: int
    prayers: [Prayer]


@dataclass()
class InputSetup:
    npc: NpcStats
    combat_stats: CombatStats
    gear_setups: [[GearSetup]]

    boosts: [Boost]

    raid_level: int = None
    path_level: int = None
