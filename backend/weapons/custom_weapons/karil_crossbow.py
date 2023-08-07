import math
import random

from constant import TICK_LENGTH
from input_setup.gear_ids import AMULET_OF_DAMNED, KARIL_SET
from model.damage_sim_results.special_proc import SpecialProc
from model.gear_setup import GearSetup
from model.npc.combat_stats import CombatStats
from model.npc.npc_stats import NpcStats
from weapons.weapon import Weapon

SPEC_CHANCE = 0.25


class KarilCrossbow(Weapon):
    def __init__(self, gear_setup: GearSetup, combat_stats: CombatStats, npc: NpcStats, raid_level):
        super().__init__(gear_setup, combat_stats, npc, raid_level)

        self.is_amulet_and_set = (set(KARIL_SET).issubset(self.gear_setup.equipped_gear.ids) and
                                  AMULET_OF_DAMNED in self.gear_setup.equipped_gear.ids)

    def roll_damage(self):
        super().roll_damage()

        if self.is_amulet_and_set:
            if random.random() <= SPEC_CHANCE:
                self.hitsplat.hitsplats = [self.hitsplat.damage, math.floor(self.hitsplat.damage / 2)]
                self.hitsplat.damage = sum(self.hitsplat.hitsplats)
                self.hitsplat.special_procs.append(SpecialProc.KARIL_DOUBLE_HIT)

    def get_dps(self):
        if not self.is_amulet_and_set:
            return super().get_dps()

        accuracy = self.get_accuracy()
        max_hits = self.get_dps_max_hit()

        total_average_damage_normal = self.get_average_damage(max_hits)
        total_average_damage_spec = self.get_average_damage([max_hits, math.floor(max_hits / 2)])
        average_damage = ((1 - SPEC_CHANCE) * accuracy * total_average_damage_normal +
                          SPEC_CHANCE * accuracy * total_average_damage_spec)

        return average_damage / (self.gear_setup.gear_stats.attack_speed * TICK_LENGTH)
