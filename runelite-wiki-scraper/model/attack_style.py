from dataclasses import dataclass

from model.attack_type import AttackType
from model.combat_style import CombatStyle


@dataclass()
class AttackStyle:
    name: str
    attack_type: AttackType
    combat_style: CombatStyle
