from enum import Enum


class Style(Enum):
    NONE = 0
    MELEE = 1
    RANGED = 2
    MAGIC = 3


STYLE_STATS = {
    Style.MELEE: ["astab", "aslash", "acrush", "str"],
    Style.RANGED: ["arange", "rstr"],
    Style.MAGIC: ["amagic", "mdmg"],
}
