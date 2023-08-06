import math
import random

from input_setup.gear_ids import AHRIM_SET, AMULET_OF_DAMNED
from model.damage_sim_results.special_proc import SpecialProc
from model.gear_setup import GearSetup
from model.npc.combat_stats import CombatStats
from model.npc.npc_stats import NpcStats
from weapons.weapon import Weapon


class AhrimStaff(Weapon):
    def __init__(self, gear_setup: GearSetup, combat_stats: CombatStats, npc: NpcStats, raid_level):
        super().__init__(gear_setup, combat_stats, npc, raid_level)

        self.is_amulet_and_set = (set(AHRIM_SET).issubset(self.gear_setup.equipped_gear.ids) and
                                  AMULET_OF_DAMNED in self.gear_setup.equipped_gear.ids and
                                  self.gear_setup.spell is not None)

    def roll_damage(self):
        super().roll_damage()

        if self.is_amulet_and_set:
            if random.random() <= 0.25:
                self.hitsplat.hitsplats = math.floor(self.hitsplat.damage * 1.3)
                self.hitsplat.damage = self.hitsplat.hitsplats
                self.hitsplat.special_procs.append(SpecialProc.AHRIM_INCREASED_DMG)


