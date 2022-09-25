import math
import random

from dps_calculator import DpsCalculator
from model.npc_stats import NpcStats
from weapon import Weapon


class DragonClaws(Weapon):

    def roll_damage(self, current_hitpoints, npc: NpcStats) -> int:
        if not self.is_special_attack:
            return super().roll_damage(current_hitpoints, npc)

        self.accuracy = self.get_accuracy(npc)
        hit = random.random()
        if hit <= self.accuracy:
            hit1 = random.randint(math.floor(self.max_hit / 2), self.max_hit - 1)
            hit2 = math.floor(hit1 / 2)
            hit3 = math.floor(hit2 / 2)
            hit4 = hit3 + round(random.random())
        else:
            hit = random.random()
            if hit <= self.accuracy:
                hit1 = 0
                hit2 = random.randint(math.floor(self.max_hit * (3/8)), math.floor(self.max_hit * (7/8)))
                hit3 = math.floor(hit2 / 2)
                hit4 = hit3 + round(random.random())
            else:
                hit = random.random()
                if hit <= self.accuracy:
                    hit1 = 0
                    hit2 = 0
                    hit3 = random.randint(math.floor(self.max_hit * (1/4)), math.floor(self.max_hit * (3/4)))
                    hit4 = hit3 + round(random.random())
                else:
                    hit = random.random()
                    if hit <= self.accuracy:
                        hit1 = 0
                        hit2 = 0
                        hit3 = 0
                        hit4 = random.randint(math.floor(self.max_hit * 0.25), math.floor(self.max_hit * 1.25))
                    else:
                        hit1 = 0
                        hit2 = 0
                        hit3 = random.randint(0, 1)
                        hit4 = hit3

        return hit1 + hit2 + hit3 + hit4

    def get_defence_roll(self, npc: NpcStats):
        if not self.is_special_attack:
            return super().get_defence_roll(npc)

        target_defence = npc.combat_stats.defence
        # always roll against slash
        target_defence_style = npc.defensive_stats.slash
        return DpsCalculator.get_defence_roll(target_defence, target_defence_style)

    def get_dps(self):
        if self.is_special_attack:
            return 0
        else:
            return DpsCalculator.get_dps(self.max_hit, self.accuracy, self.attack_speed)
