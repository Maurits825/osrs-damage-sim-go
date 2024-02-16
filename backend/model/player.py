from dataclasses import dataclass

from damage_sim.damage_sim import MAX_SPECIAL_ATTACK


@dataclass()
class Player:
    special_attack: int
    is_weapon_switched: bool

    def __init__(self):
        self.special_attack = MAX_SPECIAL_ATTACK
        self.is_weapon_switched = False
