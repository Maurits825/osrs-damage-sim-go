from enum import Enum


class SpecialProc(str, Enum):
    RUBY_BOLTS = "RubyBolts"
    DIAMOND_BOLTS = "DiamondBolts"
    GADDERHAMMER = "Gadderhammer"
    BRIMSTONE = "Brimstone"
    ZULRAH_DMG_CAP = "ZulrahDmgCap"
    MIGHTY_STACK_GAIN = "MightyStackGain"
    AHRIM_INCREASED_DMG = "AhrimIncreasedDmg"
