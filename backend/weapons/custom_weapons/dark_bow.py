from __future__ import annotations

import math
import random

from input_setup.gear_ids import DRAGON_ARROWS
from model.gear_setup import GearSetup
from model.npc.combat_stats import CombatStats
from model.npc.npc_stats import NpcStats
from weapons.weapon import Weapon

DRAGON_ARROW_DMG_MULT = 1.5
DRAGON_ARROW_MIN_DMG = 8

NORMAL_ARROW_DMG_MULT = 1.3
NORMAL_ARROW_MIN_DMG = 5

SPECIAL_DAMAGE_CAP = 48


class DarkBow(Weapon):
    def __init__(self, gear_setup: GearSetup, gear_setup_settings, npc: NpcStats, player, raid_level):
        super().__init__(gear_setup, gear_setup_settings, npc, player, raid_level)

        self.special_min_dmg = (DRAGON_ARROW_MIN_DMG if DRAGON_ARROWS in self.gear_setup.equipped_gear.ids
                                else NORMAL_ARROW_MIN_DMG)

    def get_base_max_hit(self) -> int | list[int]:
        base_max_hit = super().get_base_max_hit()
        max_hit = base_max_hit
        if self.gear_setup.is_special_attack:
            special_dmg_multiplier = (DRAGON_ARROW_DMG_MULT if DRAGON_ARROWS in self.gear_setup.equipped_gear.ids
                                      else NORMAL_ARROW_DMG_MULT)
            max_hit = min(math.floor(base_max_hit * special_dmg_multiplier), SPECIAL_DAMAGE_CAP)

        return [max_hit, max_hit]

    def roll_damage(self):
        hitsplats = []
        roll_hits = []
        for hit in range(2):
            damage, roll_hit = self.roll_single_hit()
            hitsplats.append(damage)
            roll_hits.append(roll_hit)

        self.hitsplat.set_hitsplat(damage=sum(hitsplats), hitsplats=hitsplats, roll_hits=roll_hits,
                                   accuracy=self.accuracy, max_hits=self.max_hit)

    def roll_single_hit(self):
        damage = 0
        roll_hit = self.roll_hit()
        if roll_hit:
            damage = int(random.random() * (self.max_hit[0] + 1))

        damage = math.floor(damage * self.damage_multiplier)

        if self.gear_setup.is_special_attack:
            damage = max(self.special_min_dmg, damage)

        return damage, roll_hit

    # TODO dps spreadsheet has the bh darkbow spec dps implementation
    def get_average_damage_hit(self, hit):
        if self.gear_setup.is_special_attack:
            return max(self.special_min_dmg, math.floor(hit * self.damage_multiplier))
        else:
            return math.floor(hit * self.damage_multiplier)
