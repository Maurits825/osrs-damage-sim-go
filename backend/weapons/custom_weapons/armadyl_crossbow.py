from weapons.weapon import Weapon


class ArmadylCrossbow(Weapon):
    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return super().get_attack_roll() * 2
        else:
            return super().get_attack_roll()

    def roll_damage(self):
        normal_proc_chance = self.special_bolt.proc_chance

        if self.gear_setup.is_special_attack:
            self.set_spec_proc_chance()

        super().roll_damage()
        self.special_bolt.proc_chance = normal_proc_chance

    def get_dps(self):
        normal_proc_chance = self.special_bolt.proc_chance

        if self.gear_setup.is_special_attack:
            self.set_spec_proc_chance()

        dps = super().get_dps()
        self.special_bolt.proc_chance = normal_proc_chance

        return dps

    def set_spec_proc_chance(self):
        self.special_bolt.proc_chance = self.special_bolt.base_proc_chance * 2
        if self.gear_setup.is_kandarin_diary:
            self.special_bolt.proc_chance += self.special_bolt.base_proc_chance * 0.1
