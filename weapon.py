import random
from dps_calculator import DpsCalculator
from model.attack_style import AttackStyle
from model.attack_type import AttackType
from model.combat_stats import CombatStats
from model.npc_stats import NpcStats
from model.prayer import PrayerMultiplier
from model.weapon_stats import WeaponStats


class Weapon:
    MELEE_TYPES = [AttackType.STAB, AttackType.SLASH, AttackType.CRUSH]

    def __init__(self, attack_style: AttackStyle, attack_speed):
        self.attack_style = attack_style
        self.attack_speed = attack_speed

        self.combat_stats: CombatStats = None
        self.gear_stats: WeaponStats = None
        self.prayer = None

        self.attack_roll = 0
        self.accuracy = 0
        self.max_hit = 0

    def set_combat_stats(self, combat_stats: CombatStats):
        self.combat_stats = combat_stats

    def set_prayer(self, prayer: PrayerMultiplier):
        self.prayer = prayer

    def set_total_gear_stats(self, total_gear_stats):
        self.gear_stats = total_gear_stats

    def roll_damage(self, current_hitpoints, npc: NpcStats) -> int:
        self.accuracy = self.get_accuracy(npc)
        hit = random.random()
        damage = 0
        if hit <= self.accuracy:
            damage = random.randint(0, self.max_hit)

        return damage

    def get_accuracy(self, npc: NpcStats):
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

        defence_roll = DpsCalculator.get_defence_roll(target_defence, target_defence_style)
        return DpsCalculator.get_hit_chance(self.attack_roll, defence_roll)

    def update_attack_roll(self):
        self.attack_roll = self.get_attack_roll()

    def update_max_hit(self):
        self.max_hit = self.get_max_hit()

    # TODO gear bonus & style void boosts
    def get_max_hit(self):
        if self.attack_style.attack_type in Weapon.MELEE_TYPES:
            effective_melee_str = DpsCalculator.get_effective_melee_str(
                prayer=self.prayer,
                strength_lvl=self.combat_stats.strength,
                attack_style_boost=self.attack_style.combat_style.value.strength,
                melee_void_boost=1
            )
            gear_melee_strength = self.gear_stats.melee_strength
            gear_bonus = 1
            return DpsCalculator.get_melee_max_hit(effective_melee_str, gear_melee_strength, gear_bonus)
        elif self.attack_style.attack_type == AttackType.RANGED:
            effective_ranged_str = DpsCalculator.get_effective_ranged_str(
                prayer=self.prayer,
                ranged_lvl=self.combat_stats.ranged,
                attack_style_boost=self.attack_style.combat_style.value.ranged,
                ranged_void_boost=1
            )
            gear_ranged_strength = self.gear_stats.ranged_strength
            gear_bonus = 1
            return DpsCalculator.get_ranged_max_hit(effective_ranged_str, gear_ranged_strength, gear_bonus)
        elif self.attack_style.attack_type == AttackType.MAGIC:
            return 0

    # TODO void boost & magic
    def get_attack_roll(self):
        effective_skill_attack_lvl = 0
        gear_skill_bonus = 0

        if self.attack_style.attack_type in Weapon.MELEE_TYPES:
            effective_skill_attack_lvl = DpsCalculator.get_effective_melee_attack(
                prayer=self.prayer,
                attack_lvl=self.combat_stats.attack,
                attack_style_boost=self.attack_style.combat_style.value.attack,
                void_boost=1
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
                void_boost=1
            )
            gear_skill_bonus = self.gear_stats.ranged
        elif self.attack_style.attack_type == AttackType.MAGIC:
            #TODO effective mage lvl
            gear_skill_bonus = self.gear_stats.magic

        # TODO gear bonus: blackmask/slayer hem, salve amulet/ei
        gear_bonus = 1
        return DpsCalculator.get_attack_roll(effective_skill_attack_lvl, gear_skill_bonus, gear_bonus)

    def get_dps(self):
        return DpsCalculator.get_dps(self.max_hit, self.accuracy, self.attack_speed)
