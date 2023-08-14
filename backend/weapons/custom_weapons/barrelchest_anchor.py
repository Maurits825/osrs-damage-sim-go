from __future__ import annotations

import math

from model.hitsplat import Hitsplat
from model.npc.npc_stats import NpcStats
from model.stat_drain_type import StatDrainType
from model.stat_drain_weapon import StatDrainWeapon
from weapons.weapon import Weapon


class BarrelchestAnchor(Weapon, StatDrainWeapon):
    stat_drain_type = StatDrainType.DAMAGE

    def get_max_hit(self) -> int | list[int]:
        max_hit = super().get_max_hit()
        if self.gear_setup.is_special_attack:
            return math.floor(max_hit * 1.1)
        else:
            return max_hit

    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return super().get_attack_roll() * 2
        else:
            return super().get_attack_roll()

    def attack(self) -> Hitsplat:
        hitsplat = super().attack()
        if self.gear_setup.is_special_attack:
            BarrelchestAnchor.drain_stats(self.npc, hitsplat.damage)

        return hitsplat

    @staticmethod
    def drain_stats(npc: NpcStats, damage):
        npc.combat_stats.defence = max(npc.min_defence, npc.combat_stats.defence - math.floor(damage * 0.1))
