from __future__ import annotations

from dataclasses import dataclass

from model.damage_sim_results.special_proc import SpecialProc


@dataclass()
class Hitsplat:
    damage: int
    hitsplats: int | list[int]
    roll_hits: bool | list[bool]
    special_proc: SpecialProc

    def set_hitsplat(self, damage, hitsplats, roll_hits, special_proc):
        self.damage = damage
        self.hitsplats = hitsplats
        self.roll_hits = roll_hits
        self.special_proc = special_proc
