from dataclasses import dataclass

from weapons.weapon import Weapon


@dataclass()
class TickData:
    current_weapon: Weapon
