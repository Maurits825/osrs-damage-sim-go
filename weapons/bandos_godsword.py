import math

from dps_calculator import DpsCalculator
from model.npc_stats import NpcStats
from weapon import Weapon


class BandosGodsword(Weapon):
    def get_max_hit(self):
        if self.is_special_attack:
            return math.floor(super().get_max_hit() * 1.21)
        else:
            return super().get_max_hit()

    def get_attack_roll(self):
        if self.is_special_attack:
            return 2 * super().get_attack_roll()
        else:
            return super().get_attack_roll()

    def get_defence_roll(self, npc: NpcStats):
        if not self.is_special_attack:
            return super().get_defence_roll(npc)

        target_defence = npc.combat_stats.defence
        # always roll against slash
        target_defence_style = npc.defensive_stats.slash
        return DpsCalculator.get_defence_roll(target_defence, target_defence_style)

    def roll_damage(self) -> int:
        damage = super().roll_damage()
        if self.is_special_attack:
            self.npc.drain_defence(damage)
        return damage
