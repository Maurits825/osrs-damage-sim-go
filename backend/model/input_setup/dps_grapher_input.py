from dataclasses import dataclass
from enum import Enum

from model.input_setup.input_setup import InputSetup


class InputValueType(Enum):
    DRAGON_WARHAMMER = "Dragon warhammer"
    BANDOS_GODSWORD = "Bandos godsword"
    ATTACK = "Attack"
    STRENGTH = "Strength"
    RANGED = "Ranged"
    MAGIC = "Magic"
    NPC_HITPOINTS = "Npc hitpoints"


@dataclass()
class DpsGrapherSettings:
    type: InputValueType
    min: int
    max: int


@dataclass()
class DpsGrapherInput:
    settings: DpsGrapherSettings
    input_setup: InputSetup


