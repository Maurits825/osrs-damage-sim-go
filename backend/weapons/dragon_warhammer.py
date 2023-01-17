import math

from weapon import Weapon


class DragonWarhammer(Weapon):
    def get_max_hit(self):
        if self.gear_setup.is_special_attack:
            return math.floor(super().get_max_hit() * 1.5)
        else:
            return super().get_max_hit()

    def roll_damage(self) -> int:
        damage = super().roll_damage()
        if self.gear_setup.is_special_attack:
            if damage != 0:
                self.npc.drain_defence_percent(30)
            elif "Tekton" in self.npc.name:  # TODO test
                self.npc.drain_defence_percent(5)
        return damage
