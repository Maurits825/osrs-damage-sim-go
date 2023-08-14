from __future__ import annotations

import random

from model.damage_sim_results.special_proc import SpecialProc
from model.hitsplat import Hitsplat


class BoltSpecialAttack:
    base_proc_chance: float
    proc_chance: float
    effect_value: float

    def roll_special(self, max_hit, current_hp) -> Hitsplat | None:
        hit = random.random()
        if hit <= self.proc_chance:
            return self.special(max_hit, current_hp)

        return None

    def special(self, max_hit, current_hp) -> Hitsplat:
        damage, max_hit = self.roll_damage(max_hit, current_hp)
        return Hitsplat(damage=damage, hitsplats=damage, roll_hits=True,
                        accuracy=self.proc_chance, max_hits=max_hit,
                        special_procs=[SpecialProc(self.__class__.__name__)])

    def roll_damage(self, max_hit, hp) -> (int, int):
        return 0, 0

    def special_max_hit(self, max_hit, hp) -> int:
        return 0

    def get_dps(self, accuracy, max_hit, attack_speed, hp) -> float:
        return 0
