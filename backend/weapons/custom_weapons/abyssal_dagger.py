import math
import random

from weapons.weapon import Weapon


class AbyssalDagger(Weapon):
    def get_max_hit(self) -> int | list[int]:
        max_hit = super().get_max_hit()
        if self.gear_setup.is_special_attack:
            max_hit = math.floor(max_hit * 0.85)
            return [max_hit, max_hit]
        else:
            return max_hit

    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return math.floor(super().get_attack_roll() * 1.25)
        else:
            return super().get_attack_roll()

    def get_npc_defence_and_style(self):
        if not self.gear_setup.is_special_attack:
            return super().get_npc_defence_and_style()

        target_defence = self.npc.combat_stats.defence
        target_defence_style = self.npc.defensive_stats.slash
        return target_defence, target_defence_style

    def roll_damage(self):
        if self.gear_setup.is_special_attack:
            self.roll_spec_damage()
        else:
            super().roll_damage()

    def roll_spec_damage(self):
        roll_hit = self.roll_hit()
        if roll_hit:
            hitsplats = []
            for hit in range(2):
                damage = int(random.random() * (self.max_hit[0] + 1))
                hitsplats.append(damage)
        else:
            hitsplats = [0, 0]

        roll_hits = [roll_hit, roll_hit]

        self.hitsplat.set_hitsplat(damage=sum(hitsplats), hitsplats=hitsplats, roll_hits=roll_hits,
                                   accuracy=self.accuracy, max_hits=self.max_hit)
