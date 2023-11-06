from __future__ import annotations

import math
import random

from constant import TICK_LENGTH
from model.gear_setup import GearSetup
from model.input_setup.gear_setup_settings import GearSetupSettings
from model.npc.npc_stats import NpcStats
from weapons.weapon import Weapon


class DragonClaws(Weapon):
    def __init__(self, gear_setup: GearSetup, gear_setup_settings: GearSetupSettings, npc: NpcStats, raid_level):
        super().__init__(gear_setup, gear_setup_settings, npc, raid_level)

        self.spec_min_hit = []

    def roll_damage(self):
        if not self.gear_setup.is_special_attack:
            return super().roll_damage()

        if self.roll_hit():
            hit1 = random.randint(self.spec_min_hit[0], self.max_hit[0])
            hit2 = math.floor(hit1 / 2)
            hit3 = math.floor(hit2 / 2)
            hit4 = hit3 + round(random.random())
        else:
            if self.roll_hit():
                hit1 = 0
                hit2 = random.randint(self.spec_min_hit[1], self.max_hit[1])
                hit3 = math.floor(hit2 / 2)
                hit4 = hit3 + round(random.random())
            else:
                if self.roll_hit():
                    hit1 = 0
                    hit2 = 0
                    hit3 = random.randint(self.spec_min_hit[2], self.max_hit[2])
                    hit4 = hit3 + round(random.random())
                else:
                    if self.roll_hit():
                        hit1 = 0
                        hit2 = 0
                        hit3 = 0
                        hit4 = random.randint(self.spec_min_hit[3], self.max_hit[3])
                    else:
                        hit1 = 0
                        hit2 = 0
                        hit3 = random.randint(0, 1)
                        hit4 = hit3

        self.hitsplat.set_hitsplat(damage=sum([hit1, hit2, hit3, hit4]), hitsplats=[hit1, hit2, hit3, hit4],
                                   accuracy=self.accuracy, max_hits=self.max_hit,
                                   roll_hits=[True, True, True, True])

    def get_npc_defence_and_style(self):
        if not self.gear_setup.is_special_attack:
            return super().get_npc_defence_and_style()

        target_defence = self.npc.combat_stats.defence
        # always roll against slash
        target_defence_style = self.npc.defensive_stats.slash
        return target_defence, target_defence_style

    def get_dps(self):
        if self.gear_setup.is_special_attack:
            accuracy = super().get_accuracy()
            max_hit = self.get_max_hit()[0]
            attack_speed = self.gear_setup.gear_stats.attack_speed * TICK_LENGTH
            dps = (((1 - accuracy) ** 0 * accuracy * 1.5 * max_hit / attack_speed) +
                   ((1 - accuracy) ** 1 * accuracy * 1.25 * max_hit / attack_speed) +
                   ((1 - accuracy) ** 2 * accuracy * 1 * max_hit / attack_speed) +
                   ((1 - accuracy) ** 3 * accuracy * 0.75 * max_hit / attack_speed) +
                   ((1 - accuracy) ** 4 * 1 / attack_speed))

            return dps
        else:
            return super().get_dps()

    def get_base_max_hit(self) -> int | list[int]:
        base_max_hit = super().get_base_max_hit()
        if self.gear_setup.is_special_attack:
            self.spec_min_hit = [
                math.floor(base_max_hit / 2),
                math.floor(base_max_hit * (3 / 8)),
                math.floor(base_max_hit * (1 / 4)),
                math.floor(base_max_hit * 0.25),
            ]
            return [
                base_max_hit - 1,
                math.floor(base_max_hit * (7 / 8)),
                math.floor(base_max_hit * (3 / 4)),
                math.floor(base_max_hit * 1.25),
            ]
        else:
            return base_max_hit

    def get_accuracy(self):
        base_accuracy = super().get_accuracy()
        if self.gear_setup.is_special_attack:
            return ((1 - base_accuracy) ** 0 * base_accuracy +
                    (1 - base_accuracy) ** 1 * base_accuracy +
                    (1 - base_accuracy) ** 2 * base_accuracy +
                    (1 - base_accuracy) ** 3 * base_accuracy)
        else:
            return base_accuracy
