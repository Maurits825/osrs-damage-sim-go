from enum import Enum

from model.attack_type import AttackType


class Style(Enum):
    NONE = 0
    MELEE_STAB = 1
    MELEE_SLASH = 2
    MELEE_CRUSH = 3
    RANGED = 4
    MAGIC = 5


ALL_STYLES = [Style.MELEE_STAB, Style.MELEE_SLASH, Style.MELEE_CRUSH, Style.RANGED, Style.MAGIC]

STYLE_TYPE_MAP = {
    Style.MELEE_STAB: AttackType.STAB,
    Style.MELEE_SLASH: AttackType.SLASH,
    Style.MELEE_CRUSH: AttackType.CRUSH,
    Style.RANGED: AttackType.RANGED,
    Style.MAGIC: AttackType.MAGIC,
}

STYLE_STATS = {
    Style.MELEE_STAB: ["astab", "str"],
    Style.MELEE_SLASH: ["aslash", "str"],
    Style.MELEE_CRUSH: ["acrush", "str"],
    Style.RANGED: ["arange", "rstr"],
    Style.MAGIC: ["amagic", "mdmg"],
}
