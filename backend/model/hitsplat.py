from __future__ import annotations

from dataclasses import dataclass

from model.damage_sim_results.special_proc import SpecialProc


@dataclass()
class Hitsplat:
    damage: int
    hitsplats: int | list[int]
    roll_hits: bool | list[bool]
    accuracy: float
    max_hits: int | list[int]
    special_procs: list[SpecialProc]

    def set_hitsplat(self, damage, hitsplats, roll_hits, accuracy, max_hits):
        self.damage = damage
        self.hitsplats = hitsplats
        self.roll_hits = roll_hits
        self.accuracy = accuracy
        self.max_hits = max_hits
