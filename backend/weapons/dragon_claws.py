import math
import random

from weapon import Weapon


class DragonClaws(Weapon):
    def roll_damage(self) -> int:
        if not self.gear_setup.is_special_attack:
            return super().roll_damage()

        if self.roll_hit():
            hit1 = random.randint(math.floor(self.max_hit / 2), self.max_hit - 1)
            hit2 = math.floor(hit1 / 2)
            hit3 = math.floor(hit2 / 2)
            hit4 = hit3 + round(random.random())
        else:
            if self.roll_hit():
                hit1 = 0
                hit2 = random.randint(math.floor(self.max_hit * (3/8)), math.floor(self.max_hit * (7/8)))
                hit3 = math.floor(hit2 / 2)
                hit4 = hit3 + round(random.random())
            else:
                if self.roll_hit():
                    hit1 = 0
                    hit2 = 0
                    hit3 = random.randint(math.floor(self.max_hit * (1/4)), math.floor(self.max_hit * (3/4)))
                    hit4 = hit3 + round(random.random())
                else:
                    if self.roll_hit():
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

    def get_npc_defence_style(self):
        if not self.gear_setup.is_special_attack:
            return super().get_npc_defence_style()

        target_defence = self.npc.combat_stats.defence
        # always roll against slash
        target_defence_style = self.npc.defensive_stats.slash
        return target_defence, target_defence_style

    def get_dps(self):
        if self.gear_setup.is_special_attack:
            self.accuracy = self.get_accuracy()

            avg_total_hit = 0

            accuracy = self.accuracy
            avg_hit1 = (math.floor(self.max_hit / 2) + (self.max_hit - 1)) / 2
            avg_hit2 = avg_hit1 / 2
            avg_hit3 = avg_hit2 / 2
            avg_hit4 = avg_hit3 + 0.5
            avg_total_hit += accuracy * (avg_hit1 + avg_hit2 + avg_hit3 + avg_hit4)

            accuracy = (1 - self.accuracy) * self.accuracy
            avg_hit1 = 0
            avg_hit2 = (math.floor(self.max_hit * (3/8)) + math.floor(self.max_hit * (7/8))) / 2
            avg_hit3 = avg_hit2 / 2
            avg_hit4 = avg_hit3 + 0.5
            avg_total_hit += accuracy * (avg_hit1 + avg_hit2 + avg_hit3 + avg_hit4)

            accuracy = (1 - self.accuracy)**2 * self.accuracy
            avg_hit1 = 0
            avg_hit2 = 0
            avg_hit3 = (math.floor(self.max_hit * (1/4)) + math.floor(self.max_hit * (3/4))) / 2
            avg_hit4 = avg_hit3 + 0.5
            avg_total_hit += accuracy * (avg_hit1 + avg_hit2 + avg_hit3 + avg_hit4)

            accuracy = (1 - self.accuracy)**3 * self.accuracy
            avg_hit1 = 0
            avg_hit2 = 0
            avg_hit3 = 0
            avg_hit4 = (math.floor(self.max_hit * 0.25) + math.floor(self.max_hit * 1.25)) / 2
            avg_total_hit += accuracy * (avg_hit1 + avg_hit2 + avg_hit3 + avg_hit4)

            accuracy = (1 - self.accuracy)**4
            avg_hit1 = 0
            avg_hit2 = 0
            avg_hit3 = 0.5
            avg_hit4 = avg_hit3
            avg_total_hit += accuracy * (avg_hit1 + avg_hit2 + avg_hit3 + avg_hit4)

            return avg_total_hit / (self.gear_setup.gear_stats.attack_speed * 0.6)
        else:
            return super().get_dps()
