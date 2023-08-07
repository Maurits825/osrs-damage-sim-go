import math
import random

from weapons.weapon import Weapon


class WebweaverBow(Weapon):
    def roll_damage(self):
        if not self.gear_setup.is_special_attack:
            return super().roll_damage()

        roll_hits = []
        damages = []
        for hit in range(4):
            damage = 0
            roll_hit = self.roll_hit()
            if roll_hit:
                damage = int(random.random() * (self.max_hit[hit] + 1))

            roll_hits.append(roll_hit)
            damages.append(damage)

        self.hitsplat.set_hitsplat(damage=sum(damages), hitsplats=damages, roll_hits=roll_hits,
                                   accuracy=self.accuracy, max_hits=self.max_hit)

    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return 2 * super().get_attack_roll()
        else:
            return super().get_attack_roll()

    def get_base_max_hit(self):
        if self.gear_setup.is_special_attack:
            max_hit = math.floor(super().get_base_max_hit() * 0.4)
            return [max_hit, max_hit, max_hit, max_hit]
        else:
            return super().get_base_max_hit()
