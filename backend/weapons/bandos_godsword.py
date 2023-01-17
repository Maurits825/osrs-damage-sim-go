import math

from dps_calculator import DpsCalculator
from weapon import Weapon


class BandosGodsword(Weapon):
    def get_max_hit(self):
        if self.gear_setup.is_special_attack:
            return math.floor(math.floor(super().get_max_hit() * 1.1) * 1.1)
        else:
            return super().get_max_hit()

    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return 2 * super().get_attack_roll()
        else:
            return super().get_attack_roll()

    def get_defence_roll(self):
        if not self.gear_setup.is_special_attack:
            return super().get_defence_roll()

        target_defence = self.npc.combat_stats.defence
        # always roll against slash
        target_defence_style = self.npc.defensive_stats.slash
        defence_roll = DpsCalculator.get_defence_roll(target_defence, target_defence_style)
        if self.raid_level:
            defence_roll = defence_roll * (1 + (self.raid_level * 0.004))

        return defence_roll

    def roll_damage(self) -> int:
        damage = super().roll_damage()
        if self.gear_setup.is_special_attack:
            self.npc.drain_defence(damage)
        return damage
