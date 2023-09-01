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


INPUT_VALUE_TYPE_LABEL = {
    InputValueType.DRAGON_WARHAMMER: "Dragon warhammer hits",
    InputValueType.BANDOS_GODSWORD: "Bandos godsword damage",
    InputValueType.ATTACK: "Attack levels",
    InputValueType.STRENGTH: "Strength levels",
    InputValueType.RANGED: "Ranged levels",
    InputValueType.MAGIC: "Magic levels",
    InputValueType.NPC_HITPOINTS: "Npc hitpoints",
}


@dataclass()
class DpsGrapherSettings:
    type: InputValueType
    min: int
    max: int


@dataclass()
class DpsGrapherInput:
    settings: DpsGrapherSettings
    input_setup: InputSetup


