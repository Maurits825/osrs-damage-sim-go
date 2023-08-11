from model.damage_sim_results.special_proc import SpecialProc
from model.gear_setup import GearSetup
from model.hitsplat import Hitsplat
from model.npc.combat_stats import CombatStats
from model.npc.npc_stats import NpcStats
from model.prayer import PrayerMultiplier
from weapons.weapon import Weapon

MAX_MIGHTY_STACK = 5
MIGHTY_STACK_MULTIPLIER = 0.06


class SoulreaperAxe(Weapon):
    def __init__(self, gear_setup: GearSetup, combat_stats: CombatStats, npc: NpcStats, raid_level):
        super().__init__(gear_setup, combat_stats, npc, raid_level)

        self.mighty_stack = 0

    def attack(self) -> Hitsplat:
        if not self.npc.is_hit:
            self.mighty_stack = 0
            self.prayer_multiplier = PrayerMultiplier.sum_prayers(self.gear_setup.prayers)
            self.max_hit = self.get_max_hit()

        hitsplat = super().attack()

        if self.mighty_stack < MAX_MIGHTY_STACK:
            self.mighty_stack += 1
            hitsplat.special_procs.append(SpecialProc.MIGHTY_STACK_GAIN)
            self.prayer_multiplier.strength += MIGHTY_STACK_MULTIPLIER

            self.max_hit = self.get_max_hit()

        return hitsplat

    # TODO special attack... uses stacks not spec energy

    def get_dps_max_hit(self):
        self.prayer_multiplier.strength += MAX_MIGHTY_STACK * MIGHTY_STACK_MULTIPLIER

        return self.get_max_hit()
