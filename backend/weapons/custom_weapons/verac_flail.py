import random

from constant import TICK_LENGTH
from input_setup.gear_ids import VERAC_SET
from model.damage_sim_results.special_proc import SpecialProc
from model.gear_setup import GearSetup
from model.npc.combat_stats import CombatStats
from model.npc.npc_stats import NpcStats
from weapons.weapon import Weapon

SPEC_CHANCE = 0.25


class VeracFlail(Weapon):
    def __init__(self, gear_setup: GearSetup, combat_stats: CombatStats, npc: NpcStats, player, raid_level):
        super().__init__(gear_setup, combat_stats, npc, player, raid_level)

        self.is_set = set(VERAC_SET).issubset(self.gear_setup.equipped_gear.ids)

    def roll_hit(self) -> bool:
        if self.is_set:
            if random.random() <= SPEC_CHANCE:
                self.hitsplat.special_procs.append(SpecialProc.VERAC_DEFILER)
                return True

        return super().roll_hit()

    def roll_damage(self):
        super().roll_damage()

        if self.is_set and SpecialProc.VERAC_DEFILER in self.hitsplat.special_procs:
            self.hitsplat.hitsplats += 1
            self.hitsplat.damage = self.hitsplat.hitsplats

    def get_dps(self):
        if not self.is_set:
            return super().get_dps()

        accuracy = self.get_accuracy()
        max_hits = self.get_dps_max_hit()

        total_average_damage_normal = self.get_average_damage(max_hits)
        total_average_damage_spec = self.get_average_damage(max_hits + 1)
        average_damage = ((1 - SPEC_CHANCE) * accuracy * total_average_damage_normal +
                          SPEC_CHANCE * total_average_damage_spec)

        return average_damage / (self.gear_setup.gear_stats.attack_speed * TICK_LENGTH)
