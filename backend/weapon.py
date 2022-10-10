import random
from dps_calculator import DpsCalculator
from model.attack_style.attack_type import AttackType
from model.npc.combat_stats import CombatStats
from model.attack_style.combat_style import CombatStyle
from model.npc.npc_stats import NpcStats
from model.prayer import PrayerMultiplier
from model.weapon_stats import WeaponStats


class Weapon:
    MELEE_TYPES = [AttackType.STAB, AttackType.SLASH, AttackType.CRUSH]

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

        self.raid_level = None

        self.void_skill_attack_boost = 1
        self.void_skill_str_boost = 1

    def initialize(self, attack_style, attack_speed,
                   void_attack, void_strength,
                   combat_stats: CombatStats,
                   prayer: PrayerMultiplier,
                   total_gear_stats, raid_level, is_special_attack,
                   npc: NpcStats):
        self.set_attack_style_and_speed(attack_style, attack_speed)
        self.set_void_boost(void_attack, void_strength)
        self.set_combat_stats(combat_stats)
        self.set_prayer(prayer)
        self.set_total_gear_stats(total_gear_stats)
        self.set_raid_level(raid_level)
        self.set_is_special_attack(is_special_attack)
        self.set_npc(npc)

        self.update_attack_roll()
        self.update_max_hit()

    def set_attack_style_and_speed(self, attack_style, attack_speed):
        self.attack_style = attack_style
        self.attack_speed = attack_speed

        if self.attack_style.combat_style == CombatStyle.RAPID:
            self.attack_speed -= 1

    def set_void_boost(self, attack, strength):
        self.void_skill_attack_boost = attack
        self.void_skill_str_boost = strength

    def set_combat_stats(self, combat_stats: CombatStats):
        self.combat_stats = combat_stats

    def set_prayer(self, prayer: PrayerMultiplier):
        self.prayer = prayer

    def set_total_gear_stats(self, total_gear_stats):
        self.gear_stats = total_gear_stats

    def set_raid_level(self, raid_level):
        self.raid_level = raid_level

    def set_is_special_attack(self, is_special_attack):
        self.is_special_attack = is_special_attack

    def set_npc(self, npc):
        self.npc = npc

    def update_attack_roll(self):
        self.attack_roll = self.get_attack_roll()

    def update_max_hit(self):
        self.max_hit = self.get_max_hit()

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

    # TODO gear bonus & style void boosts
    def get_max_hit(self):
        if self.attack_style.attack_type in Weapon.MELEE_TYPES:
            effective_melee_str = DpsCalculator.get_effective_melee_str(
                prayer=self.prayer,
                strength_lvl=self.combat_stats.strength,
                attack_style_boost=self.attack_style.combat_style.value.strength,
                melee_void_boost=self.void_skill_str_boost
            )
            gear_melee_strength = self.gear_stats.melee_strength
            gear_bonus = 1
            return DpsCalculator.get_melee_max_hit(effective_melee_str, gear_melee_strength, gear_bonus)
        elif self.attack_style.attack_type == AttackType.RANGED:
            effective_ranged_str = DpsCalculator.get_effective_ranged_str(
                prayer=self.prayer,
                ranged_lvl=self.combat_stats.ranged,
                attack_style_boost=self.attack_style.combat_style.value.ranged,
                ranged_void_boost=self.void_skill_str_boost
            )
            gear_ranged_strength = self.gear_stats.ranged_strength
            gear_bonus = 1
            return DpsCalculator.get_ranged_max_hit(effective_ranged_str, gear_ranged_strength, gear_bonus)
        elif self.attack_style.attack_type == AttackType.MAGIC:
            #TODO
            return 0

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

    # TODO void boost & magic
    def get_attack_roll(self):
        effective_skill_attack_lvl = 0
        gear_skill_bonus = 0

        if self.attack_style.attack_type in Weapon.MELEE_TYPES:
            effective_skill_attack_lvl = DpsCalculator.get_effective_melee_attack(
                prayer=self.prayer,
                attack_lvl=self.combat_stats.attack,
                attack_style_boost=self.attack_style.combat_style.value.attack,
                void_boost=self.void_skill_attack_boost
            )

            if self.attack_style.attack_type == AttackType.STAB:
                gear_skill_bonus = self.gear_stats.stab
            elif self.attack_style.attack_type == AttackType.SLASH:
                gear_skill_bonus = self.gear_stats.slash
            elif self.attack_style.attack_type == AttackType.CRUSH:
                gear_skill_bonus = self.gear_stats.crush

        elif self.attack_style.attack_type == AttackType.RANGED:
            effective_skill_attack_lvl = DpsCalculator.get_effective_ranged_attack(
                prayer=self.prayer,
                ranged_lvl=self.combat_stats.ranged,
                attack_style_boost=self.attack_style.combat_style.value.ranged,
                void_boost=self.void_skill_attack_boost
            )
            gear_skill_bonus = self.gear_stats.ranged
        elif self.attack_style.attack_type == AttackType.MAGIC:
            #TODO effective mage lvl
            gear_skill_bonus = self.gear_stats.magic

        # TODO gear bonus: blackmask/slayer hem, salve amulet/ei
        gear_bonus = 1
        return DpsCalculator.get_attack_roll(effective_skill_attack_lvl, gear_skill_bonus, gear_bonus)

    def get_dps(self):
        self.accuracy = self.get_accuracy()
        return DpsCalculator.get_dps(self.max_hit, self.accuracy, self.attack_speed)
