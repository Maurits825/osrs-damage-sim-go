import random
import math
from dps_calculator import DpsCalculator
from model.weapon_category import WeaponCategory


# figure this stuff out, flesh out a basic weapon class
# get accuracy from dps funct and stuff, figure out ranged/melee ...
class Weapon(DpsCalculator):
    def __init__(self, weapon_category: WeaponCategory):
        self.weapon_category = weapon_category

    def roll_damage(self, health=0) -> int:
        hit = random.random()
        damage = 0
        if hit <= (self.accuracy / 100.0):
            damage = random.randint(0, self.max_hit)

        return damage
