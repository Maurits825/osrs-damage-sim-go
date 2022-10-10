from weapons.bandos_godsword import BandosGodsword
from weapons.bone_dagger import BoneDagger
from weapons.dragon_claws import DragonClaws
from weapons.dragon_warhammer import DragonWarhammer
from weapons.fang import Fang
from weapons.scythe import Scythe
from weapons.twisted_bow import TwistedBow
from weapons.zaryte_crossbow import ZaryteCrossbow

CUSTOM_WEAPONS = {
    "Dragon claws": DragonClaws(),
    "Zaryte crossbow": ZaryteCrossbow(),
    "Twisted bow": TwistedBow(),
    "Bandos godsword": BandosGodsword(),
    "Bone dagger": BoneDagger(),
    "Osmumten's fang": Fang(),
    "Dragon warhammer": DragonWarhammer(),
    "Scythe of vitur": Scythe(),
}

TOA_PATH_LEVEL_NPCS = {
    "Zebak", "Kephri", "Ba-Ba", "Akkha"
}

VOID = {8839, 8840, 8842}
ELITE_VOID = {13072, 13073, 8842}
MELEE_VOID = 11665
MAGE_VOID = 11663
RANGED_VOID = 11664
BLOWPIPE = 12926
