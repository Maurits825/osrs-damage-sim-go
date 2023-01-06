import math

from model.locations import Location
from weapon import Weapon


class TwistedBow(Weapon):
    def get_attack_roll(self):
        magic = self.get_magic()
        accuracy_multiplier = min(
            140.0,
            140 + ((((10 * 3 * magic) / 10) - 10) / 100) - (((((3 * magic) / 10) - 100)**2) / 100)
        )

        return math.floor(super().get_attack_roll() * (round(accuracy_multiplier) / 100))

    def get_max_hit(self):
        magic = self.get_magic()
        damage_multiplier = min(
            250.0,
            250 + ((((10 * 3 * magic) / 10) - 14) / 100) - (((((3 * magic) / 10) - 140) ** 2) / 100)
        )

        return math.floor(super().get_max_hit() * (round(damage_multiplier) / 100))

    def get_magic(self):
        if self.npc.location == Location.CHAMBERS_OF_XERIC:
            return min(350, max(self.npc.combat_stats.magic, self.npc.aggressive_stats.magic))
        else:
            return min(250, max(self.npc.combat_stats.magic, self.npc.aggressive_stats.magic))
