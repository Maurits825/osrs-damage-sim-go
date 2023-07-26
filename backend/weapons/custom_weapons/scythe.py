from __future__ import annotations

import math
import random

from model.gear_setup import GearSetup
from model.npc.combat_stats import CombatStats
from model.npc.npc_stats import NpcStats
from weapons.weapon import Weapon

HIT_COUNT_REDUCTION = [1, 0.5, 0.25]


class Scythe(Weapon):
    def __init__(self, gear_setup: GearSetup, combat_stats: CombatStats, npc: NpcStats, raid_level):
        super().__init__(gear_setup, combat_stats, npc, raid_level)

        self.hitsplat.hitsplats = [0 for _ in range(min(3, self.npc.size))]
        self.hitsplat.roll_hits = [False for _ in range(min(3, self.npc.size))]

    def roll_damage(self):
        self.roll_single_hit(0)

        if self.npc.size > 1:
            self.roll_single_hit(1)
        if self.npc.size > 2:
            self.roll_single_hit(2)

        self.hitsplat.damage = sum(self.hitsplat.hitsplats)
        self.hitsplat.accuracy = self.accuracy
        self.hitsplat.max_hits = self.max_hit

    def roll_single_hit(self, hit_count) -> (int, bool):
        damage = 0
        roll_hit = self.roll_hit()
        if roll_hit:
            damage = int(random.random() * (self.max_hit[0] + 1))

        damage = math.floor(damage * HIT_COUNT_REDUCTION[hit_count])

        self.hitsplat.hitsplats[hit_count] = damage
        self.hitsplat.roll_hits[hit_count] = roll_hit

    def get_base_max_hit(self) -> list[int]:
        base_max_hit = super().get_base_max_hit()

        max_hits = [math.floor(base_max_hit * hit_reduction) for hit_reduction in HIT_COUNT_REDUCTION]

        return max_hits[:self.npc.size]
