import math
import random

from weapons.weapon import Weapon


class DragonKnife(Weapon):
    def get_max_hit(self) -> int | list[int]:
        max_hit = super().get_max_hit()
        if self.gear_setup.is_special_attack:
            return [max_hit, max_hit]
        else:
            return max_hit

    def roll_damage(self):
        if self.gear_setup.is_special_attack:
            self.roll_spec_damage()
        else:
            super().roll_damage()

    def roll_spec_damage(self):
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

        return damage, roll_hit
