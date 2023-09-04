from dataclasses import dataclass
from enum import Enum

from model.input_setup.input_setup import InputSetup


class InputValueType(Enum):
    DRAGON_WARHAMMER = "Dragon warhammer"
    BANDOS_GODSWORD = "Bandos godsword"
    ARCLIGHT = "Arclight"
    BONE_DAGGER = "Bone dagger"
    ACCURSED_SCEPTRE = "Accursed sceptre"
    BARRELCHEST_ANCHOR = "Barrelchest anchor"
    ATTACK = "Attack"
    STRENGTH = "Strength"
    RANGED = "Ranged"
    MAGIC = "Magic"
    NPC_HITPOINTS = "Npc hitpoints"


STAT_DRAIN_INPUT_TYPE = [
    InputValueType.DRAGON_WARHAMMER,
    InputValueType.BANDOS_GODSWORD,
    InputValueType.ARCLIGHT,
    InputValueType.BONE_DAGGER,
    InputValueType.ACCURSED_SCEPTRE,
    InputValueType.BARRELCHEST_ANCHOR,
]

LEVEL_INPUT_TYPE = [
    InputValueType.ATTACK,
    InputValueType.STRENGTH,
    InputValueType.RANGED,
    InputValueType.MAGIC,
]

INPUT_VALUE_TYPE_LABEL = {
    InputValueType.DRAGON_WARHAMMER: "Dragon warhammer hits",
    InputValueType.BANDOS_GODSWORD: "Bandos godsword damage",
    InputValueType.ARCLIGHT: "Arclight hits",
    InputValueType.BONE_DAGGER: "Bone dagger damage",
    InputValueType.ACCURSED_SCEPTRE: "Accursed Sceptre hits",
    InputValueType.BARRELCHEST_ANCHOR: "Anchor damage",
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


