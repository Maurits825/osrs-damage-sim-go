from weapons.claw_spec import ClawSpec
from weapons.weapon import Weapon
import numpy as np
import click

from weapons.zcb_spec import ZcbSpec


class WeaponDps:

    def simulate(self, weapon: Weapon, health, iterations):
        damages = []
        for i in range(iterations):
            damages.append(weapon.roll_damage(health))

        return damages

    def get_dps(self, damages, weapon: Weapon):
        np_damages = np.array(damages)
        average = np.average(np_damages)

        return average / (weapon.attack_speed * 0.6)

    def run(self, weapon: Weapon, health, iterations):
        damages = self.simulate(weapon, health, iterations)
        dps = self.get_dps(damages, weapon)
        print("Weapon: " + weapon.name + ", dps: " + str(dps))


@click.command()
def main():
    weapon_dps = WeaponDps()

    #weapon = ClawSpec(45, 64.55, 4, 1)
    #weapon = ZcbSpec(110, 92.96, 5)
    weapon = ZcbSpec(110, 88.27, 5)
    weapon_dps.run(weapon, 380, 100000)


if __name__ == '__main__':
    main()
