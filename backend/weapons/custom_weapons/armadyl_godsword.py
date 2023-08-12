import math

from weapons.weapon import Weapon


class ArmadylGodsword(Weapon):
    def get_max_hit(self) -> int | list[int]:
        max_hit = super().get_max_hit()
        if self.gear_setup.is_special_attack:
            return math.floor(math.floor(max_hit * 1.1) * 1.25)
        else:
            return max_hit

    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return super().get_attack_roll() * 2
        else:
            return super().get_attack_roll()

    def get_npc_defence_and_style(self):
        if not self.gear_setup.is_special_attack:
            return super().get_npc_defence_and_style()

        target_defence = self.npc.combat_stats.defence
        target_defence_style = self.npc.defensive_stats.slash
        return target_defence, target_defence_style

