import random

from constant import TICK_LENGTH
from model.damage_sim_results.special_proc import SpecialProc
from weapons.weapon import Weapon

SPEC_CHANCE = 1 / 51
SPEC_DMG_MULTIPLIER = 3


class Keris(Weapon):
    def roll_damage(self):
        super().roll_damage()

        if random.random() <= SPEC_CHANCE:
            self.hitsplat.hitsplats *= SPEC_DMG_MULTIPLIER
            self.hitsplat.damage = self.hitsplat.hitsplats
            self.hitsplat.special_procs.append(SpecialProc.KERIS_TRIPLE_DMG)
            self.hitsplat.max_hits *= SPEC_DMG_MULTIPLIER

    def get_dps(self):
        accuracy = self.get_accuracy()
        max_hits = self.get_dps_max_hit()

        total_average_damage_normal = self.get_average_damage(max_hits)
        total_average_damage_spec = self.get_average_damage(max_hits * SPEC_DMG_MULTIPLIER)
        average_damage = ((1 - SPEC_CHANCE) * accuracy * total_average_damage_normal +
                          SPEC_CHANCE * accuracy * total_average_damage_spec)

        return average_damage / (self.gear_setup.gear_stats.attack_speed * TICK_LENGTH)
