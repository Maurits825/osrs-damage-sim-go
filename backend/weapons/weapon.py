from __future__ import annotations

import math
import random

from constant import TICK_LENGTH
from input_setup.gear_ids import (TRIDENT_SWAMP, SHADOW_STAFF, SANG_STAFF, CHAOS_GAUNTLETS, BRIMSTONE, TRIDENT_SEAS,
                                  DAWNBRINGER, HARM_STAFF, OSMUMTEN_FANG, THAMMARON_SCEPTRE, ACCURSED_SCEPTRE)
from input_setup.special_gear_bonus import SpecialGearBonus
from model.attack_style.attack_type import AttackType
from model.attack_style.combat_style import CombatStyle
from model.combat_boost import CombatBoost
from model.damage_sim_results.special_proc import SpecialProc
from model.gear_setup import GearSetup
from model.hitsplat import Hitsplat
from model.locations import Location
from model.npc.combat_stats import CombatStats
from model.npc.npc_ids import VERZIK_P1, ZULRAH, ICE_DEMON, CORP, VARDORVIS
from model.npc.npc_stats import NpcStats
from model.prayer import PrayerMultiplier
from weapons.bolt_loader import BoltLoader
from weapons.bolt_special_attack import BoltSpecialAttack
from weapons.dps_calculator import DpsCalculator
from wiki_data.wiki_data import WikiData

ZULRAH_MAX_DMG = 50
ZULRAH_MIN_DMG = 45
VERZIK_P1_MELEE_DMG_CAP = 10
VERZIK_P1_RANGE_MAGE_DMG_CAP = 3
CORP_MAX_DMG = 50


class Weapon:
    MELEE_TYPES = [AttackType.STAB, AttackType.SLASH, AttackType.CRUSH]

    def __init__(self, gear_setup: GearSetup, combat_stats: CombatStats, npc: NpcStats, raid_level):
        self.gear_setup = gear_setup
        self.combat_stats = combat_stats
        self.npc = npc
        self.raid_level = raid_level

        self.special_attack_cost = WikiData.get_special_attack(gear_setup.gear_stats.name)
        self.prayer_multiplier = PrayerMultiplier.sum_prayers(self.gear_setup.prayers)

        self.damage_multiplier = SpecialGearBonus.get_damage_multiplier(
            self.gear_setup.equipped_gear, self.npc, self.gear_setup.current_hp,
            self.combat_stats.hitpoints, self.gear_setup.mining_lvl
        )

        self.special_bolt: BoltSpecialAttack | None = BoltLoader.get_equipped_special_bolt(
            self.gear_setup.equipped_gear,
            self.gear_setup.is_kandarin_diary,
        )

        self.void_bonus: CombatBoost() = SpecialGearBonus.get_gear_void_bonuses(self.gear_setup.equipped_gear)
        self.special_gear_bonus: CombatBoost() = SpecialGearBonus.get_gear_bonus(
            self.gear_setup.equipped_gear, self.gear_setup.attack_style, self.gear_setup.is_on_slayer_task,
            self.gear_setup.is_in_wilderness, self.npc, self.gear_setup.spell
        )

        self.is_brimstone = self.get_is_brimstone()
        self.set_attack_speed()

        self.verzik_dmg_cap = (
            VERZIK_P1_MELEE_DMG_CAP if self.gear_setup.attack_style.attack_type in Weapon.MELEE_TYPES
            else VERZIK_P1_RANGE_MAGE_DMG_CAP)

        self.is_post_attack = npc.id in VARDORVIS

        self.max_hit = 0
        self.accuracy = 0
        self.attack_roll = 0
        self.defence_roll = 0
        self.target_defence = None
        self.target_defence_style = None
        self.update_dps_stats()

        self.hitsplat = Hitsplat(0, 0, False, 0, 0, [])

    def set_npc(self, npc):
        self.npc = npc

    def set_combat_stats(self, combat_stats):
        self.combat_stats = combat_stats
        self.update_dps_stats()

    def update_dps_stats(self):
        self.attack_roll = self.get_attack_roll()
        self.update_target_defence_and_roll()
        self.max_hit = self.get_max_hit()
        self.update_accuracy()

    def update_accuracy(self):
        self.accuracy = self.get_accuracy()

    def update_target_defence_and_roll(self):
        self.target_defence, self.target_defence_style = self.get_npc_defence_and_style()
        self.defence_roll = DpsCalculator.get_defence_roll(self.target_defence, self.target_defence_style)

    def get_is_brimstone(self):
        return (self.gear_setup.attack_style.attack_type == AttackType.MAGIC and
                BRIMSTONE in self.gear_setup.equipped_gear.ids)

    def set_attack_speed(self):
        if self.gear_setup.attack_style.combat_style == CombatStyle.RAPID:
            self.gear_setup.gear_stats.attack_speed -= 1

        if self.gear_setup.spell:
            self.gear_setup.gear_stats.attack_speed = 5

            if (HARM_STAFF in self.gear_setup.equipped_gear.ids and
                    self.gear_setup.spell in WikiData.get_standard_spells()):
                self.gear_setup.gear_stats.attack_speed = 4

    def roll_hit(self) -> bool:
        attack_roll = int(random.random() * (self.attack_roll + 1))
        defence_roll = int(random.random() * (self.get_defence_roll() + 1))

        return attack_roll > defence_roll

    # flake8: noqa TODO look at refactoring this, maybe also cache is_verzik_p1, is_zulrah, is_corp, enum?
    def attack(self) -> Hitsplat:
        self.hitsplat.special_procs = []

        self.roll_damage()

        # TODO hitsplat as int | list[int] makes it kinda scuffed
        # TODO also could make a better way to handle the hitsplat?
        if self.npc.id in VERZIK_P1 and self.gear_setup.gear_stats.id != DAWNBRINGER:
            if isinstance(self.hitsplat.hitsplats, list):
                hitsplats = []
                for hitsplat in self.hitsplat.hitsplats:
                    capped_dmg_roll = int(random.random() * (self.verzik_dmg_cap + 1))
                    if capped_dmg_roll < hitsplat:
                        hitsplats.append(capped_dmg_roll)
                    else:
                        hitsplats.append(hitsplat)
                self.hitsplat.damage = sum(hitsplats)
            else:
                capped_dmg_roll = int(random.random() * (self.verzik_dmg_cap + 1))
                hitsplats = self.hitsplat.hitsplats
                if capped_dmg_roll < self.hitsplat.hitsplats:
                    hitsplats = capped_dmg_roll
                self.hitsplat.damage = hitsplats

            self.hitsplat.hitsplats = hitsplats
        elif self.npc.id in ZULRAH:
            if isinstance(self.hitsplat.hitsplats, list):
                hitsplats = [int((random.random() * (ZULRAH_MAX_DMG - ZULRAH_MIN_DMG + 1)) + ZULRAH_MIN_DMG)
                             if hitsplat > ZULRAH_MAX_DMG else hitsplat
                             for hitsplat in self.hitsplat.hitsplats]
                self.hitsplat.hitsplats = hitsplats
                self.hitsplat.damage = sum(hitsplats)
            else:
                if self.hitsplat.hitsplats > ZULRAH_MAX_DMG:
                    self.hitsplat.hitsplats = int((random.random() * (ZULRAH_MAX_DMG - ZULRAH_MIN_DMG + 1)) +
                                                  ZULRAH_MIN_DMG)
                    self.hitsplat.damage = self.hitsplat.hitsplats
                    self.hitsplat.special_procs.append(SpecialProc.ZULRAH_DMG_CAP)
        elif self.npc.id in CORP:
            if isinstance(self.hitsplat.hitsplats, list):
                hitsplats = [min(hitsplat, CORP_MAX_DMG) for hitsplat in self.hitsplat.hitsplats]
                self.hitsplat.hitsplats = hitsplats
                self.hitsplat.damage = sum(hitsplats)
            else:
                hitsplats = min(self.hitsplat.hitsplats, CORP_MAX_DMG)
                self.hitsplat.hitsplats = hitsplats
                self.hitsplat.damage = self.hitsplat.hitsplats

        if self.is_post_attack:
            self.post_attack()

        return self.hitsplat

    def post_attack(self):
        if self.npc.id in VARDORVIS:
            self.npc.combat_stats.defence = (
                    self.npc.base_combat_stats.defence -
                    math.floor(
                        (0.1 * (self.npc.base_combat_stats.hitpoints -
                                (self.npc.combat_stats.hitpoints - self.hitsplat.damage)))))

            self.update_target_defence_and_roll()
            self.update_accuracy()

    def roll_damage(self):  # TODO consider refactoring so that this returns damage, roll hit? so attack() sets hitsplat
        if self.special_bolt:
            bolt_damage = BoltSpecialAttack.roll_special(
                self.special_bolt, self.max_hit, self.npc.combat_stats.hitpoints
            )
            if bolt_damage:
                self.hitsplat = bolt_damage
                return

        damage = 0
        roll_hit = self.roll_hit()
        if roll_hit:
            damage = int(random.random() * (self.max_hit + 1))

        damage = math.floor(damage * self.damage_multiplier)

        self.hitsplat.set_hitsplat(damage=damage, hitsplats=damage, roll_hits=roll_hit,
                                   accuracy=self.accuracy, max_hits=self.max_hit)

    def get_accuracy(self):
        attack_roll = self.get_attack_roll()
        defence_roll = self.get_average_defence_roll()

        return DpsCalculator.get_hit_chance(attack_roll, defence_roll)

    def get_base_max_hit(self) -> int | list[int]:
        if self.gear_setup.attack_style.attack_type in Weapon.MELEE_TYPES:
            effective_melee_str = DpsCalculator.get_effective_melee_str(
                prayer=self.prayer_multiplier,
                strength_lvl=self.combat_stats.strength,
                attack_style_boost=self.gear_setup.attack_style.combat_style.value.strength,
                melee_void_boost=self.void_bonus.melee.strength_boost[-1]
            )
            gear_melee_strength = self.gear_setup.gear_stats.melee_strength
            return DpsCalculator.get_melee_max_hit(effective_melee_str, gear_melee_strength,
                                                   self.special_gear_bonus.melee.strength_boost)
        elif self.gear_setup.attack_style.attack_type == AttackType.RANGED:
            effective_ranged_str = DpsCalculator.get_effective_ranged_str(
                prayer=self.prayer_multiplier,
                ranged_lvl=self.combat_stats.ranged,
                attack_style_boost=self.gear_setup.attack_style.combat_style.value.ranged,
                ranged_void_boost=self.void_bonus.ranged.strength_boost[-1]
            )
            gear_ranged_strength = self.gear_setup.gear_stats.ranged_strength
            return DpsCalculator.get_ranged_max_hit(effective_ranged_str, gear_ranged_strength,
                                                    self.special_gear_bonus.ranged.strength_boost)
        elif self.gear_setup.attack_style.attack_type == AttackType.MAGIC:
            return self.get_magic_max_hit()

    def get_max_hit(self) -> int | list[int]:
        base_max_hit = self.get_base_max_hit()

        multiplier = 1
        if self.npc.id in ICE_DEMON:
            if self.gear_setup.spell and ("Fire" in self.gear_setup.spell or
                                          "Flames of Zamorak" in self.gear_setup.spell):
                multiplier = 1.5
            else:
                multiplier = 0.35
        elif self.npc.id in CORP:
            multiplier = self.get_corp_multiplier()

        if isinstance(base_max_hit, list):
            max_hit = [int(multiplier * hit) for hit in base_max_hit]
        else:
            max_hit = int(multiplier * base_max_hit)
        return max_hit

    def get_defence_roll(self):
        actual_defence_roll = self.defence_roll

        if self.is_brimstone:
            if random.random() <= 0.25:
                actual_defence_roll -= max(0, math.floor(self.defence_roll * 0.1))
                self.hitsplat.special_procs.append(SpecialProc.BRIMSTONE)

        if self.raid_level:
            actual_defence_roll = math.floor(self.defence_roll * (1 + (self.raid_level * 0.004)))

        return actual_defence_roll

    def get_average_defence_roll(self):
        target_defence, target_defence_style = self.get_npc_defence_and_style()
        defence_roll = DpsCalculator.get_defence_roll(target_defence, target_defence_style)

        if self.is_brimstone:
            defence_roll -= math.floor(defence_roll * 0.1) / 4

        if self.raid_level:
            defence_roll = defence_roll * (1 + (self.raid_level * 0.004))

        return math.floor(defence_roll)

    def get_npc_defence_and_style(self) -> (int, int):
        target_defence = 0
        target_defence_style = 0

        if self.gear_setup.attack_style.attack_type in Weapon.MELEE_TYPES:
            target_defence = self.npc.combat_stats.defence
            if self.gear_setup.attack_style.attack_type == AttackType.STAB:
                target_defence_style = self.npc.defensive_stats.stab
            elif self.gear_setup.attack_style.attack_type == AttackType.SLASH:
                target_defence_style = self.npc.defensive_stats.slash
            elif self.gear_setup.attack_style.attack_type == AttackType.CRUSH:
                target_defence_style = self.npc.defensive_stats.crush
        elif self.gear_setup.attack_style.attack_type == AttackType.RANGED:
            target_defence = self.npc.combat_stats.defence
            target_defence_style = self.npc.defensive_stats.ranged
        elif self.gear_setup.attack_style.attack_type == AttackType.MAGIC:
            if self.npc.id in ICE_DEMON:
                target_defence = self.npc.combat_stats.defence
            else:
                target_defence = self.npc.combat_stats.magic

            target_defence_style = self.npc.defensive_stats.magic

        return target_defence, target_defence_style

    def get_attack_roll(self):
        effective_skill_attack_lvl = 0
        gear_skill_bonus = 0
        gear_attack_bonus = 1

        if self.gear_setup.attack_style.attack_type in Weapon.MELEE_TYPES:
            gear_attack_bonus = self.special_gear_bonus.melee.attack_boost
            effective_skill_attack_lvl = DpsCalculator.get_effective_melee_attack(
                prayer=self.prayer_multiplier,
                attack_lvl=self.combat_stats.attack,
                attack_style_boost=self.gear_setup.attack_style.combat_style.value.attack,
                void_boost=self.void_bonus.melee.attack_boost[-1]
            )

            if self.gear_setup.attack_style.attack_type == AttackType.STAB:
                gear_skill_bonus = self.gear_setup.gear_stats.stab
            elif self.gear_setup.attack_style.attack_type == AttackType.SLASH:
                gear_skill_bonus = self.gear_setup.gear_stats.slash
            elif self.gear_setup.attack_style.attack_type == AttackType.CRUSH:
                gear_skill_bonus = self.gear_setup.gear_stats.crush

        elif self.gear_setup.attack_style.attack_type == AttackType.RANGED:
            gear_attack_bonus = self.special_gear_bonus.ranged.attack_boost
            effective_skill_attack_lvl = DpsCalculator.get_effective_ranged_attack(
                prayer=self.prayer_multiplier,
                ranged_lvl=self.combat_stats.ranged,
                attack_style_boost=self.gear_setup.attack_style.combat_style.value.ranged,
                void_boost=self.void_bonus.ranged.attack_boost[-1]
            )
            gear_skill_bonus = self.gear_setup.gear_stats.ranged
        elif self.gear_setup.attack_style.attack_type == AttackType.MAGIC:
            gear_attack_bonus = self.special_gear_bonus.magic.attack_boost
            effective_skill_attack_lvl = DpsCalculator.get_effective_magic_level(
                prayer=self.prayer_multiplier,
                magic_lvl=self.combat_stats.magic,
                attack_style_boost=self.gear_setup.attack_style.combat_style.value.magic,
                void_boost=self.void_bonus.magic.attack_boost[-1]
            )
            if self.gear_setup.gear_stats.id in SHADOW_STAFF and not self.gear_setup.spell:
                shadow_mult = 4 if self.npc.location == Location.TOMBS_OF_AMASCUT else 3
                gear_skill_bonus = self.gear_setup.gear_stats.magic * shadow_mult
            else:
                gear_skill_bonus = self.gear_setup.gear_stats.magic

        return DpsCalculator.get_attack_roll(effective_skill_attack_lvl, gear_skill_bonus, gear_attack_bonus)

    def get_dps_max_hit(self):
        return self.get_max_hit()

    def get_dps(self):
        accuracy = self.get_accuracy()
        max_hits = self.get_dps_max_hit()

        # TODO zulrah for bolts and zcb spec ...
        # TODO could add on the spec bolt dps, and then also have an accuracy modifier or something
        if self.special_bolt:
            return self.special_bolt.get_dps(
                accuracy, max_hits, self.gear_setup.gear_stats.attack_speed, self.npc.base_combat_stats.hitpoints
            )

        total_average_damage = self.get_average_damage(max_hits)

        return (total_average_damage * accuracy) / (self.gear_setup.gear_stats.attack_speed * TICK_LENGTH)

    def get_average_damage_hit(self, hit):
        return math.floor(hit * self.damage_multiplier)

    def get_average_damage(self, max_hits: int | list[int]) -> float:
        total_average_damage = 0
        max_hits = [max_hits] if not isinstance(max_hits, list) else max_hits
        for max_hit in max_hits:
            damage_sum = 0
            for hit in range(max_hit + 1):
                damage = self.get_average_damage_hit(hit)
                if self.npc.id in ZULRAH:
                    if damage > ZULRAH_MAX_DMG:
                        damage = (ZULRAH_MAX_DMG + ZULRAH_MIN_DMG) / 2
                elif self.npc.id in VERZIK_P1 and self.gear_setup.gear_stats.id != DAWNBRINGER:
                    damages = [min(hit, capped_hit) for capped_hit in range(self.verzik_dmg_cap + 1)]
                    damage = sum(damages) / len(damages)
                elif self.npc.id in CORP:
                    damage = min(damage, CORP_MAX_DMG)
                damage_sum += damage

            average_damage = damage_sum / (max_hit + 1)
            total_average_damage += average_damage

        return total_average_damage

    def get_magic_max_hit(self):
        base_max_hit = self.get_magic_base_hit()

        if CHAOS_GAUNTLETS in self.gear_setup.equipped_gear.ids and "Bolt" in self.gear_setup.spell:
            base_max_hit += 3

        magic_dmg_multiplier = self.gear_setup.gear_stats.magic_strength / 100

        if self.gear_setup.gear_stats.id in SHADOW_STAFF and not self.gear_setup.spell:
            shadow_mult = 4 if self.npc.location == Location.TOMBS_OF_AMASCUT else 3
            magic_dmg_multiplier *= shadow_mult

        magic_dmg_multiplier += self.void_bonus.magic.strength_boost[-1]
        base_hit = math.floor(base_max_hit * magic_dmg_multiplier)
        max_hit = DpsCalculator.apply_gear_bonus(base_hit, self.special_gear_bonus.magic.strength_boost)

        if self.gear_setup.gear_stats.id == DAWNBRINGER:
            max_hit = math.floor(math.floor(self.combat_stats.magic * magic_dmg_multiplier) / 6) - 1

        return max_hit

    def get_magic_base_hit(self):
        if self.gear_setup.spell:
            return WikiData.get_all_spells()[self.gear_setup.spell]

        if self.gear_setup.gear_stats.id in TRIDENT_SEAS:
            return math.floor(self.combat_stats.magic / 3) - 5
        elif self.gear_setup.gear_stats.id in TRIDENT_SWAMP:
            return math.floor(self.combat_stats.magic / 3) - 2
        elif self.gear_setup.gear_stats.id in SANG_STAFF:
            return math.floor(self.combat_stats.magic / 3) - 1
        elif self.gear_setup.gear_stats.id in SHADOW_STAFF:
            return math.floor(self.combat_stats.magic / 3) + 1
        elif self.gear_setup.gear_stats.id in THAMMARON_SCEPTRE:
            return math.floor(self.combat_stats.magic / 3) - 8
        elif self.gear_setup.gear_stats.id in ACCURSED_SCEPTRE:
            return math.floor(self.combat_stats.magic / 3) - 6
        else:
            return 0

    def get_corp_multiplier(self) -> float:
        if self.gear_setup.attack_style.attack_type == AttackType.MAGIC:
            return 1

        if (self.gear_setup.attack_style.attack_type == AttackType.STAB and
                ("spear" in self.gear_setup.gear_stats.name or
                 "halberd" in self.gear_setup.gear_stats.name or
                 self.gear_setup.gear_stats.id in OSMUMTEN_FANG)):
            return 1

        return 0.5
