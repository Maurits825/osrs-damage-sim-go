import math
import random

from model.gear_setup import GearSetup
from model.npc.combat_stats import CombatStats
from model.npc.npc_stats import NpcStats
from weapons.dps_calculator import DpsCalculator
from weapons.weapon import Weapon

HIT_COUNT_REDUCTION = [1, 0.5, 0.25]


class Scythe(Weapon):
    def __init__(self, gear_setup: GearSetup, combat_stats: CombatStats, npc: NpcStats, raid_level):
        super().__init__(gear_setup, combat_stats, npc, raid_level)

        self.hitsplat.hitsplats = [0 for _ in range(min(3, self.npc.size))]
        self.hitsplat.roll_hits = [False for _ in range(min(3, self.npc.size))]

    def roll_damage(self) -> list[int]:
        self.roll_single_hit(0)

        if self.npc.size > 1:
            self.roll_single_hit(1)
        if self.npc.size > 2:
            self.roll_single_hit(2)

        self.hitsplat.damage = sum(self.hitsplat.hitsplats)
        self.hitsplat.accuracy = self.accuracy
        self.hitsplat.max_hits = self.max_hit
        return self.hitsplat

    def roll_single_hit(self, hit_count) -> (int, bool):
        damage = 0
        roll_hit = self.roll_hit()
        if roll_hit:
            damage = int(random.random() * (self.max_hit[0] + 1))

        damage = math.floor(damage * HIT_COUNT_REDUCTION[hit_count])

        self.hitsplat.hitsplats[hit_count] = damage
        self.hitsplat.roll_hits[hit_count] = roll_hit

    def get_dps(self):
        accuracy = self.get_accuracy()
        max_hit = self.get_max_hit()

        effective_max_hit = max_hit[0]
        if self.npc.size > 1:
            effective_max_hit += max_hit[1]
        if self.npc.size > 2:
            effective_max_hit += max_hit[2]

        return DpsCalculator.get_dps(effective_max_hit, accuracy, self.gear_setup.gear_stats.attack_speed)

    def get_max_hit(self) -> list[int]:
        base_max_hit = super().get_max_hit()

        return [
            math.floor(base_max_hit * hit_reduction) for hit_reduction in HIT_COUNT_REDUCTION
        ]
