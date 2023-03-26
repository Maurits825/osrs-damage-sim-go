from __future__ import annotations

from dataclasses import dataclass


@dataclass()
class TickData:
    tick: int
    weapon_name: str
    is_special_attack: bool
    max_hit: int
    accuracy: float
    hitsplats: int | list[int]

    npc_hitpoints: int
    npc_defence: int

    special_attack_amount: float
