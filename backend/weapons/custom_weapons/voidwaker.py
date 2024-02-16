from __future__ import annotations

import math
import random

from constant import TICK_LENGTH
from model.gear_setup import GearSetup
from model.input_setup.gear_setup_settings import GearSetupSettings
from model.npc.npc_stats import NpcStats
from weapons.weapon import Weapon

SPEC_MIN_MULT = 0.5
SPEC_MAX_MULT = 1.5


class Voidwaker(Weapon):
    def __init__(self, gear_setup: GearSetup, gear_setup_settings: GearSetupSettings, npc: NpcStats, player, raid_level):
        super().__init__(gear_setup, gear_setup_settings, npc, player, raid_level)

        self.spec_min_hit = 0

    def get_corp_multiplier(self) -> float:
        if self.gear_setup.is_special_attack:
            return 1
        else:
            return super().get_corp_multiplier()

    def get_max_hit(self) -> int | list[int]:
        max_hit = super().get_max_hit()

        self.spec_min_hit = math.floor(max_hit * SPEC_MIN_MULT)
        if self.gear_setup.is_special_attack:
            return math.floor(max_hit * SPEC_MAX_MULT)
        else:
            return max_hit

    def get_accuracy(self):
        if not self.gear_setup.is_special_attack:
            return super().get_accuracy()

        return 1

    def roll_damage(self):
        if self.gear_setup.is_special_attack:
            self.roll_spec_damage()
        else:
            super().roll_damage()

    def roll_spec_damage(self):
        damage = int((random.random() * (self.max_hit - self.spec_min_hit + 1)) + self.spec_min_hit)

        self.hitsplat.set_hitsplat(damage=damage, hitsplats=damage, roll_hits=True,
                                   accuracy=self.accuracy, max_hits=self.max_hit)

    def get_dps(self):
        if not self.gear_setup.is_special_attack:
            return super().get_dps()

        # TODO ignores dmg reduction and stuff for now
        return ((self.spec_min_hit + self.max_hit) / 2) / (self.gear_setup.gear_stats.attack_speed * TICK_LENGTH)
