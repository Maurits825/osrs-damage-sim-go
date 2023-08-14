from __future__ import annotations

import math

from model.npc.npc_stats import NpcStats
from model.stat_drain_type import StatDrainType
from model.stat_drain_weapon import StatDrainWeapon
from weapons.weapon import Weapon

DRAIN_AMOUNT = 0.15


class AccursedSceptre(Weapon, StatDrainWeapon):
    stat_drain_type = StatDrainType.HITS

    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return math.floor(super().get_attack_roll() * 1.5)
        else:
            return super().get_attack_roll()

    def get_base_max_hit(self):
        if self.gear_setup.is_special_attack:
            return math.floor(super().get_base_max_hit() * 1.5)
        else:
            return super().get_base_max_hit()

    def roll_hit(self) -> bool:
        roll_hit = super().roll_hit()

        if roll_hit and self.gear_setup.is_special_attack:
            AccursedSceptre.drain_stats(self.npc, None)

        return roll_hit

    @staticmethod
    def drain_stats(npc: NpcStats, _):
        npc.combat_stats.magic = npc.base_combat_stats.magic - math.floor(npc.base_combat_stats.magic * DRAIN_AMOUNT)
        npc.combat_stats.defence = npc.base_combat_stats.defence - math.floor(
            npc.base_combat_stats.defence * DRAIN_AMOUNT)
