import math

from weapons.weapon import Weapon


class TwistedBow(Weapon):
    def get_attack_roll(self):
        magic = self.get_magic()
        accuracy_multiplier = min(
            140,
            140 + int(((10 * int(3 * magic / 10)) - 10) / 100) - int(((((3 * magic) / 10) - 100) ** 2) / 100)
        )

        return math.floor(super().get_attack_roll() * (round(accuracy_multiplier) / 100))

    def get_base_max_hit(self):
        magic = int(3 * self.get_magic() / 10)
        damage_multiplier = min(250, int(250 + (magic * 10 - 14) / 100 - int((magic - 140) * (magic - 140) / 100)))

        return math.floor(super().get_base_max_hit() * (round(damage_multiplier) / 100))

    def get_magic(self):
        if self.npc.is_xerician:
            return min(350, max(self.npc.combat_stats.magic, self.npc.aggressive_stats.magic))
        else:
            return min(250, max(self.npc.combat_stats.magic, self.npc.aggressive_stats.magic))
