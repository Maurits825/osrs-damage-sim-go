from constant import TICK_LENGTH
from model.damage_sim_results.special_proc import SpecialProc
from model.gear_setup import GearSetup
from model.hitsplat import Hitsplat
from model.npc.combat_stats import CombatStats
from model.npc.npc_stats import NpcStats
from weapons.bolt_special_attack import BoltSpecialAttack
from weapons.custom_weapons.diamond_bolts import DiamondBolts
from weapons.custom_weapons.ruby_bolts import RubyBolts
from weapons.weapon import Weapon


class ZaryteCrossbow(Weapon):
    def __init__(self, gear_setup: GearSetup, combat_stats: CombatStats, npc: NpcStats, raid_level):
        super().__init__(gear_setup, combat_stats, npc, raid_level)
        if self.special_bolt:
            if isinstance(self.special_bolt, RubyBolts):
                self.special_bolt.effect_value = 0.22
            elif isinstance(self.special_bolt, DiamondBolts):
                self.special_bolt.effect_value = 0.25

    def roll_damage(self):
        if not self.gear_setup.is_special_attack or not self.special_bolt:
            return super().roll_damage()

        if self.roll_hit():
            hitsplat = BoltSpecialAttack.special(self.special_bolt, self.max_hit, self.npc.combat_stats.hitpoints)
            hitsplat.accuracy = self.accuracy
            self.hitsplat = hitsplat
        else:
            bolt_damage = BoltSpecialAttack.roll_special(self.special_bolt, self.max_hit,
                                                         self.npc.combat_stats.hitpoints)
            if bolt_damage:
                self.hitsplat = bolt_damage
            else:
                self.hitsplat.set_hitsplat(damage=0, hitsplats=0, roll_hits=False, accuracy=self.accuracy,
                                           max_hits=self.max_hit, special_proc=SpecialProc.NONE)

    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return 2 * super().get_attack_roll()
        else:
            return super().get_attack_roll()

    def get_dps(self):
        accuracy = self.get_accuracy()
        max_hit = self.get_max_hit()

        if not self.gear_setup.is_special_attack or not self.special_bolt:
            return super().get_dps()

        spec_max_hit = self.special_bolt.special_max_hit(max_hit, self.npc.base_combat_stats.hitpoints)
        if isinstance(self.special_bolt, RubyBolts):
            avg_dmg = accuracy * spec_max_hit + ((1 - accuracy) *
                                                 self.special_bolt.proc_chance * spec_max_hit)
            return avg_dmg / (self.gear_setup.gear_stats.attack_speed * TICK_LENGTH)

        elif isinstance(self.special_bolt, DiamondBolts):
            avg_dmg = (accuracy * spec_max_hit * 0.5) + ((1 - accuracy) *
                                                         self.special_bolt.proc_chance * spec_max_hit * 0.5)
            return avg_dmg / (self.gear_setup.gear_stats.attack_speed * TICK_LENGTH)
