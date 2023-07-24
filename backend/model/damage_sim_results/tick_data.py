from __future__ import annotations

from dataclasses import dataclass

from model.damage_sim_results.special_proc import SpecialProc


@dataclass()
class TickData:
    tick: int
    weapon_name: str
    weapon_id: int
    is_special_attack: bool

    max_hits: int | list[int]
    accuracy: float

    damage: int
    hitsplats: int | list[int]
    roll_hits: bool | list[bool]
    special_procs: list[SpecialProc]

    npc_hitpoints: int
    npc_defence: int

    special_attack_amount: float
