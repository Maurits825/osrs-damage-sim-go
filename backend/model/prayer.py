from dataclasses import dataclass
from enum import Enum


@dataclass()
class PrayerMultiplier:
    attack: float = 0
    strength: float = 0

    ranged: float = 0
    ranged_strength: float = 0

    magic: float = 0

    @staticmethod
    def sum_prayers(prayers):
        att = 0
        stre = 0
        rng = 0
        rngstr = 0
        mag = 0
        for prayer in prayers:
            att += prayer.value.attack
            stre += prayer.value.strength
            rng += prayer.value.ranged
            rngstr += prayer.value.ranged_strength
            mag += prayer.value.magic

        return PrayerMultiplier(max(att, 1), max(stre, 1), max(rng, 1), max(rngstr, 1), max(mag, 1))


class Prayer(Enum):
    THICK_SKIN = PrayerMultiplier()
    BURST_OF_STRENGTH = PrayerMultiplier(strength=1.05)
    CLARITY_OF_THOUGHT = PrayerMultiplier(attack=1.05)
    SHARP_EYE = PrayerMultiplier(ranged=1.05, ranged_strength=1.05)
    MYSTIC_WILL = PrayerMultiplier(magic=1.05)
    ROCK_SKIN = PrayerMultiplier()
    SUPERHUMAN_STRENGTH = PrayerMultiplier(strength=1.1)
    IMPROVED_REFLEXES = PrayerMultiplier(attack=1.1)
    RAPID_HEAL = PrayerMultiplier()
    RAPID_RESTORE = PrayerMultiplier()
    PROTECT_ITEM = PrayerMultiplier()
    HAWK_EYE = PrayerMultiplier(ranged=1.1, ranged_strength=1.1)
    MYSTIC_LORE = PrayerMultiplier(magic=1.1)
    STEEL_SKIN = PrayerMultiplier()
    ULTIMATE_STRENGTH = PrayerMultiplier(strength=1.15)
    INCREDIBLE_REFLEXES = PrayerMultiplier(attack=1.15)
    PROTECT_FROM_MAGIC = PrayerMultiplier()
    PROTECT_FROM_MISSILES = PrayerMultiplier()
    PROTECT_FROM_MELEE = PrayerMultiplier()
    EAGLE_EYE = PrayerMultiplier(ranged=1.15, ranged_strength=1.15)
    MYSTIC_MIGHT = PrayerMultiplier(magic=1.15)
    RETRIBUTION = PrayerMultiplier()
    REDEMPTION = PrayerMultiplier()
    SMITE = PrayerMultiplier()
    PRESERVE = PrayerMultiplier()
    CHIVALRY = PrayerMultiplier(attack=1.15, strength=1.18)
    PIETY = PrayerMultiplier(attack=1.20, strength=1.23)
    RIGOUR = PrayerMultiplier(ranged=1.20, ranged_strength=1.23)
    AUGURY = PrayerMultiplier(magic=1.25)
