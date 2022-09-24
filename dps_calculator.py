import math

from model.prayer import Prayer


class DpsCalculator:
    def get_effective_melee_str(self, prayer: Prayer, strength_lvl, strength_boost, attack_style_boost, melee_void_boost):
        return math.floor((math.floor((strength_lvl + strength_boost) * prayer.value.strength) +
                           attack_style_boost + 8) * melee_void_boost)

    def get_effective_ranged_str(self, prayer: Prayer, ranged_lvl, ranged_boost, attack_style_boost, ranged_void_boost):
        return math.floor((math.floor((ranged_lvl + ranged_boost) * prayer.value.ranged_strength) +
                           attack_style_boost + 8) * ranged_void_boost)

    def get_effective_melee_attack(self, prayer: Prayer, attack_lvl, attack_boost, attack_style_boost, void_boost):
        return math.floor((math.floor((attack_lvl + attack_boost) * prayer.value.attack) +
                           attack_style_boost + 8) * void_boost)

    def get_effective_ranged_attack(self, prayer: Prayer, ranged_lvl, ranged_boost, attack_style_boost, void_boost):
        return math.floor((math.floor((ranged_lvl + ranged_boost) * prayer.value.ranged) +
                           attack_style_boost + 8) * void_boost)

    def get_melee_max_hit(self, effective_melee_str, gear_melee_strength, gear_bonus):
        return math.floor(math.floor(((effective_melee_str * (gear_melee_strength + 64)) + 320) / 640) *
                          gear_bonus)

    def get_ranged_max_hit(self, effective_ranged_str, gear_ranged_strength, gear_bonus):
        return math.floor(0.5 + ((effective_ranged_str * (gear_ranged_strength + 64)) / 640) * gear_bonus)

    def get_attack_roll(self, effective_skill_lvl, gear_skill_bonus, gear_bonus):
        return math.floor((effective_skill_lvl * (gear_skill_bonus + 64)) * gear_bonus)

    def get_defence_roll(self, target_defence, target_defence_style):
        return (target_defence + 9) * (target_defence_style + 64)

    def get_hit_chance(self, attack_roll, defence_roll):
        if attack_roll > defence_roll:
            return 1 - ((defence_roll + 2) / (2 * (attack_roll + 1)))
        else:
            return attack_roll / (2 * (defence_roll + 1))

    def get_dps(self, max_hit, hit_chance, attack_speed):
        return ((max_hit * hit_chance) / 2) / (attack_speed * 0.6)
