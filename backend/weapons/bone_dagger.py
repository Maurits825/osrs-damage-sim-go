from weapon import Weapon


class BoneDagger(Weapon):
    def roll_damage(self) -> int:
        damage = super().roll_damage()
        if self.is_special_attack:
            self.npc.drain_defence(damage)
        return damage

    def get_accuracy(self):
        if self.is_special_attack:
            return 1
        else:
            return super().get_accuracy()

    def roll_hit(self) -> bool:
        if self.is_special_attack:
            return True

        return super().roll_hit()
