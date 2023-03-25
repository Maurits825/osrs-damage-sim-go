from dataclasses import dataclass

from model.npc.npc_stats import NpcStats
from weapons.weapon import Weapon


@dataclass()
class TickData:
    weapon: Weapon
    accuracy: float  # this is in weapon no??
    max_hit: int  # this is in weapon no??
    damage_dealt: int

    npc: NpcStats

    special_attack_amount: float
