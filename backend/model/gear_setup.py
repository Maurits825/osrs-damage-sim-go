from dataclasses import dataclass

from model.attack_style.attack_style import AttackStyle
from model.boost import Boost
from model.condition import Condition
from model.equipped_gear import EquippedGear
from model.npc.combat_stats import CombatStats
from model.prayer import Prayer
from model.weapon_stats import WeaponStats


@dataclass()
class GearSetup:
    name: str
    gear_stats: WeaponStats
    attack_style: AttackStyle
    spell: str
    prayers: list[Prayer]
    combat_stats: CombatStats
    boosts: list[Boost]

    is_fill: bool
    conditions: list[Condition]

    equipped_gear: EquippedGear

    is_special_attack: bool
    is_on_slayer_task: bool
    is_in_wilderness: bool
    current_hp: int
    mining_lvl: int
    is_kandarin_diary: bool
