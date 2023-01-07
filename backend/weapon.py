import math
import random

from dps_calculator import DpsCalculator
from gear_bonus import GearBonus
from gear_ids import TRIDENT_SWAMP, SHADOW_STAFF, SANG_STAFF
from model.attack_style.attack_type import AttackType
from model.combat_boost import CombatBoost
from model.locations import Location
from model.npc.combat_stats import CombatStats
from model.attack_style.combat_style import CombatStyle
from model.npc.npc_stats import NpcStats
from model.prayer import PrayerMultiplier
from model.weapon_stats import WeaponStats


class Weapon:
    MELEE_TYPES = [AttackType.STAB, AttackType.SLASH, AttackType.CRUSH]

    # TODO better way to handle dataclass with none?
    def __init__(self):
        self.attack_style = None
        self.attack_speed = 0

        self.combat_stats: CombatStats = None
        self.gear_stats: WeaponStats = None
        self.npc: NpcStats = None
        self.prayer = None

        self.attack_roll = 0
        self.accuracy = 0
        self.max_hit = 0

        self.is_special_attack = False
        self.special_attack_cost = 0
        self.is_on_slayer_task = False
        self.is_in_wilderness = False
        self.max_hp = 0
        self.current_hp = 0
        self.mining_lvl = 99

        self.raid_level = None

        self.gear = dict()

        self.void_bonus = CombatBoost()
        self.special_gear_bonus = CombatBoost()

    def initialize(self, attack_style, attack_speed,
                   combat_stats: CombatStats,
                   prayer: PrayerMultiplier,
                   total_gear_stats, raid_level, is_special_attack, special_attack_cost,
                   npc: NpcStats, gear, is_on_slayer_task, is_in_wilderness, max_hp, current_hp, mining_lvl):
        self.special_attack_cost = special_attack_cost
        self.gear = gear

        self.combat_stats = combat_stats
        self.prayer = prayer
        self.gear_stats = total_gear_stats
        self.raid_level = raid_level
        self.is_special_attack = is_special_attack
        self.npc = npc

        self.is_on_slayer_task = is_on_slayer_task
        self.is_in_wilderness = is_in_wilderness
        self.max_hp = max_hp
        self.current_hp = current_hp
        self.mining_lvl = mining_lvl

        self.set_attack_style_and_speed(attack_style, attack_speed)

        self.update_special_bonus()

        self.update_attack_roll()
        self.update_max_hit()

    def set_attack_style_and_speed(self, attack_style, attack_speed):
        self.attack_style = attack_style
        self.attack_speed = attack_speed

        if self.attack_style.combat_style == CombatStyle.RAPID:
            self.attack_speed -= 1

    # TODO other bonuses like wildy weapons and salve
    def update_special_bonus(self):
        self.special_gear_bonus = GearBonus.get_gear_bonus(self.gear, self.attack_style,
                                                           self.is_on_slayer_task, self.is_in_wilderness,
                                                           self.npc, self.current_hp, self.max_hp, self.mining_lvl)
        self.void_bonus = GearBonus.get_gear_void_bonuses(self.gear)

    def update_attack_roll(self):
        self.attack_roll = self.get_attack_roll()

    def update_max_hit(self):
        self.max_hit = self.get_max_hit()

    def set_npc(self, npc):
        self.npc = npc

    def roll_damage(self) -> int:
        self.accuracy = self.get_accuracy()
        hit = random.random()
        damage = 0
        if hit <= self.accuracy:
            damage = random.randint(0, self.max_hit)

        return damage

    def get_accuracy(self):
        defence_roll = self.get_defence_roll(self.npc)
        if self.raid_level:
            defence_roll = defence_roll * (1 + (self.raid_level * 0.004))
        return DpsCalculator.get_hit_chance(self.attack_roll, defence_roll)

    def get_max_hit(self):
        if self.attack_style.attack_type in Weapon.MELEE_TYPES:
            effective_melee_str = DpsCalculator.get_effective_melee_str(
                prayer=self.prayer,
                strength_lvl=self.combat_stats.strength,
                attack_style_boost=self.attack_style.combat_style.value.strength,
                melee_void_boost=self.void_bonus.melee.strength_boost[-1]
            )
            gear_melee_strength = self.gear_stats.melee_strength
            return DpsCalculator.get_melee_max_hit(effective_melee_str, gear_melee_strength,
                                                   self.special_gear_bonus.melee.strength_boost)
        elif self.attack_style.attack_type == AttackType.RANGED:
            effective_ranged_str = DpsCalculator.get_effective_ranged_str(
                prayer=self.prayer,
                ranged_lvl=self.combat_stats.ranged,
                attack_style_boost=self.attack_style.combat_style.value.ranged,
                ranged_void_boost=self.void_bonus.ranged.strength_boost[-1]
            )
            gear_ranged_strength = self.gear_stats.ranged_strength
            return DpsCalculator.get_ranged_max_hit(effective_ranged_str, gear_ranged_strength,
                                                    self.special_gear_bonus.ranged.strength_boost)
        elif self.attack_style.attack_type == AttackType.MAGIC:
            return self.get_magic_max_hit()

    def get_defence_roll(self, npc: NpcStats):
        target_defence = 0
        target_defence_style = 0
        if self.attack_style.attack_type in Weapon.MELEE_TYPES:
            target_defence = npc.combat_stats.defence
            if self.attack_style.attack_type == AttackType.STAB:
                target_defence_style = npc.defensive_stats.stab
            elif self.attack_style.attack_type == AttackType.SLASH:
                target_defence_style = npc.defensive_stats.slash
            elif self.attack_style.attack_type == AttackType.CRUSH:
                target_defence_style = npc.defensive_stats.crush
        elif self.attack_style.attack_type == AttackType.RANGED:
            target_defence = npc.combat_stats.defence
            target_defence_style = npc.defensive_stats.ranged
        elif self.attack_style.attack_type == AttackType.MAGIC:
            target_defence = npc.combat_stats.magic
            target_defence_style = npc.defensive_stats.magic

        return DpsCalculator.get_defence_roll(target_defence, target_defence_style)

    def get_attack_roll(self):
        effective_skill_attack_lvl = 0
        gear_skill_bonus = 0
        gear_attack_bonus = 1

        if self.attack_style.attack_type in Weapon.MELEE_TYPES:
            gear_attack_bonus = self.special_gear_bonus.melee.attack_boost
            effective_skill_attack_lvl = DpsCalculator.get_effective_melee_attack(
                prayer=self.prayer,
                attack_lvl=self.combat_stats.attack,
                attack_style_boost=self.attack_style.combat_style.value.attack,
                void_boost=self.void_bonus.melee.attack_boost[-1]
            )

            if self.attack_style.attack_type == AttackType.STAB:
                gear_skill_bonus = self.gear_stats.stab
            elif self.attack_style.attack_type == AttackType.SLASH:
                gear_skill_bonus = self.gear_stats.slash
            elif self.attack_style.attack_type == AttackType.CRUSH:
                gear_skill_bonus = self.gear_stats.crush

        elif self.attack_style.attack_type == AttackType.RANGED:
            gear_attack_bonus = self.special_gear_bonus.ranged.attack_boost
            effective_skill_attack_lvl = DpsCalculator.get_effective_ranged_attack(
                prayer=self.prayer,
                ranged_lvl=self.combat_stats.ranged,
                attack_style_boost=self.attack_style.combat_style.value.ranged,
                void_boost=self.void_bonus.ranged.attack_boost[-1]
            )
            gear_skill_bonus = self.gear_stats.ranged
        elif self.attack_style.attack_type == AttackType.MAGIC:
            gear_attack_bonus = self.special_gear_bonus.magic.attack_boost
            effective_skill_attack_lvl = DpsCalculator.get_effective_magic_level(
                prayer=self.prayer,
                magic_lvl=self.combat_stats.magic,
                attack_style_boost=self.attack_style.combat_style.value.magic,
                void_boost=self.void_bonus.magic.attack_boost[-1]
            )
            if self.gear_stats.id in SHADOW_STAFF:
                shadow_mult = 4 if self.npc.location == Location.TOMBS_OF_AMASCUT else 3
                gear_skill_bonus = self.gear_stats.magic * shadow_mult
            else:
                gear_skill_bonus = self.gear_stats.magic

        return DpsCalculator.get_attack_roll(effective_skill_attack_lvl, gear_skill_bonus, gear_attack_bonus)

    def get_dps(self):
        self.accuracy = self.get_accuracy()
        return DpsCalculator.get_dps(self.max_hit, self.accuracy, self.attack_speed)

    # TODO spells
    def get_magic_max_hit(self):
        base_max_hit = 0
        magic_dmg_multiplier = 1 + (self.gear_stats.magic_strength / 100)

        if self.gear_stats.id in SANG_STAFF:
            base_max_hit = math.floor(self.combat_stats.magic / 3) - 1
        elif self.gear_stats.id in TRIDENT_SWAMP:
            base_max_hit = math.floor(self.combat_stats.magic / 3) - 2
        elif self.gear_stats.id in SHADOW_STAFF:
            base_max_hit = math.floor(self.combat_stats.magic / 3) + 1
            shadow_mult = 4 if self.npc.location == Location.TOMBS_OF_AMASCUT else 3
            magic_dmg_multiplier = 1 + (shadow_mult * (self.gear_stats.magic_strength / 100))

        # TODO test slayer bonus and salve later
        magic_dmg_multiplier += self.void_bonus.magic.strength_boost[-1] - 1
        base_hit = math.floor(base_max_hit * magic_dmg_multiplier)
        max_hit = DpsCalculator.apply_gear_bonus(base_hit, self.special_gear_bonus.magic.strength_boost)
        return max_hit
