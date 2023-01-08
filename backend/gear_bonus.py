from gear_ids import *
import re

from model.attack_style.attack_type import AttackType
from model.combat_boost import CombatBoost
from model.npc.npc_stats import NpcStats


class GearBonus:
    @staticmethod
    def get_gear_bonus(gear, attack_style, is_on_slayer_task, is_in_wilderness, npc: NpcStats,
                       mining_lvl) -> CombatBoost:
        # gear bonus list order is important, taken as from dps calc sheet

        all_gear_names = '\t'.join(gear["name"])
        special_gear_bonus = CombatBoost()

        if "bow of faerdhinen" in all_gear_names or CRYSTAL_BOW in gear["id"]:
            if CRYSTAL_HELM in gear["id"] or CRYSTAL_BODY in gear["id"] or CRYSTAL_LEGS in gear["id"]:
                crystal_att = 0
                crystal_str = 0

                if CRYSTAL_HELM in gear["id"]:
                    crystal_att += 1.05
                    crystal_str += 1.025
                if CRYSTAL_BODY in gear["id"]:
                    crystal_att += 1.15
                    crystal_str += 1.075
                if CRYSTAL_LEGS in gear["id"]:
                    crystal_att += 1.1
                    crystal_str += 1.05

                special_gear_bonus.ranged.attack_boost.append(crystal_att)
                special_gear_bonus.ranged.strength_boost.append(crystal_str)

        # salve doesnt stack with slayer helm and overrides slayer bonus
        if any(gear_id in [SALVE, SALVE_E, SALVE_I, SALVE_EI] for gear_id in gear["id"]):
            if SALVE in gear["id"]:
                special_gear_bonus.melee.attack_boost.append(7 / 6)
                special_gear_bonus.melee.strength_boost.append(7 / 6)
            elif SALVE_E in gear["id"]:
                special_gear_bonus.melee.attack_boost.append(1.2)
                special_gear_bonus.melee.strength_boost.append(1.2)
            elif SALVE_I in gear["id"]:
                special_gear_bonus.melee.attack_boost.append(7 / 6)
                special_gear_bonus.melee.strength_boost.append(7 / 6)

                special_gear_bonus.ranged.attack_boost.append(7 / 6)
                special_gear_bonus.ranged.strength_boost.append(7 / 6)

                special_gear_bonus.magic.attack_boost.append(1.15)
                special_gear_bonus.magic.strength_boost.append(1.15)
            elif SALVE_EI in gear["id"]:
                special_gear_bonus.melee.attack_boost.append(1.2)
                special_gear_bonus.melee.strength_boost.append(1.2)

                special_gear_bonus.ranged.attack_boost.append(1.2)
                special_gear_bonus.ranged.strength_boost.append(1.2)

                special_gear_bonus.magic.attack_boost.append(1.2)
                special_gear_bonus.magic.strength_boost.append(1.2)
        elif is_on_slayer_task:
            if "slayer helmet (i)" in all_gear_names or re.match(r"black mask (?:\(.*\))? ?\(i\)", all_gear_names):
                special_gear_bonus.melee.attack_boost.append(7 / 6)
                special_gear_bonus.melee.strength_boost.append(7 / 6)

                special_gear_bonus.ranged.attack_boost.append(1.15)
                special_gear_bonus.ranged.strength_boost.append(1.15)

                special_gear_bonus.magic.attack_boost.append(1.15)
                special_gear_bonus.magic.strength_boost.append(1.15)
            elif "slayer helmet" in all_gear_names or "black mask" in all_gear_names:
                special_gear_bonus.melee.attack_boost.append(7 / 6)
                special_gear_bonus.melee.strength_boost.append(7 / 6)

        if npc.is_kalphite and "keris" in all_gear_names:
            if any(keris in gear["id"] for keris in [KERIS, KERIS_PARTISAN, KERIS_SUN, KERIS_CORRUPTION]):
                special_gear_bonus.melee.strength_boost.append(1.33)
            elif KERIS_BREACHING in gear["id"]:
                special_gear_bonus.melee.attack_boost.append(1.33)
                special_gear_bonus.melee.strength_boost.append(1.33)

        if npc.is_demon and ARCLIGHT in gear["id"]:
            special_gear_bonus.melee.attack_boost.append(1.7)
            special_gear_bonus.melee.strength_boost.append(1.7)

        if npc.is_dragon:
            if any(dhcb in gear["id"] for dhcb in DRAGON_HUNTER_CROSSBOW):
                special_gear_bonus.ranged.attack_boost.append(1.3)
                special_gear_bonus.ranged.strength_boost.append(1.25)
            elif DRAGON_HUNTER_LANCE in gear["id"]:
                special_gear_bonus.melee.attack_boost.append(1.2)
                special_gear_bonus.melee.strength_boost.append(1.2)

        if is_in_wilderness:
            if CRAWS_BOW in gear["id"]:
                special_gear_bonus.ranged.attack_boost.append(1.5)
                special_gear_bonus.ranged.strength_boost.append(1.5)
            elif VIGGORA_MACE in gear["id"]:
                special_gear_bonus.melee.attack_boost.append(1.5)
                special_gear_bonus.melee.strength_boost.append(1.5)
            elif THAMMARON_SCEPTRE in gear["id"]:
                special_gear_bonus.magic.attack_boost.append(2)
                special_gear_bonus.magic.strength_boost.append(1.25)

        if OBSIDIAN_ARMOUR.issubset(gear["id"]):
            if any(obsidian_weapon in gear["id"] for obsidian_weapon in OBSIDIAN_MELEE_WEAPONS):
                special_gear_bonus.melee.attack_boost.append(1.1)
                special_gear_bonus.melee.strength_boost.append(1.1)

        if attack_style.attack_type == AttackType.CRUSH:
            inquis_count = 0
            if INQUIS_HELM in gear["id"]:
                inquis_count += 1
            if INQUIS_BODY in gear["id"]:
                inquis_count += 1
            if INQUIS_LEGS in gear["id"]:
                inquis_count += 1

            if inquis_count == 3:
                inquis_percent = 2.5
            else:
                inquis_percent = inquis_count * 0.5

            inquis_boost = 1 + (inquis_percent / 100)
            special_gear_bonus.melee.attack_boost.append(inquis_boost)
            special_gear_bonus.melee.strength_boost.append(inquis_boost)

        if npc.is_vampyre1 or npc.is_vampyre2 or npc.is_vampyre3:
            if IVANDIS_FLAIL in gear["id"]:
                special_gear_bonus.melee.strength_boost.append(1.2)
            elif BLISTERWOOD_FLAIL in gear["id"]:
                special_gear_bonus.melee.attack_boost.append(1.05)
                special_gear_bonus.melee.strength_boost.append(1.25)

        if npc.is_leafy and LEAF_BATTLE_AXE in gear["id"]:
            special_gear_bonus.melee.attack_boost.append(1.175)

        return special_gear_bonus

    @staticmethod
    def get_gear_void_bonuses(gear) -> CombatBoost:
        void_bonus = CombatBoost()

        if VOID.issubset(gear["id"]):
            if MELEE_VOID in gear["id"]:
                void_bonus.melee.attack_boost.append(1.1)
                void_bonus.melee.strength_boost.append(1.1)
            elif RANGED_VOID in gear["id"]:
                void_bonus.ranged.attack_boost.append(1.1)
                void_bonus.ranged.strength_boost.append(1.1)
            elif MAGE_VOID in gear["id"]:
                void_bonus.magic.attack_boost.append(1.45)

        elif ELITE_VOID.issubset(gear["id"]):
            if MELEE_VOID in gear["id"]:
                void_bonus.melee.attack_boost.append(1.1)
                void_bonus.melee.strength_boost.append(1.1)
            elif RANGED_VOID in gear["id"]:
                void_bonus.ranged.attack_boost.append(1.1)
                void_bonus.ranged.strength_boost.append(1.125)
            elif MAGE_VOID in gear["id"]:
                void_bonus.magic.attack_boost.append(1.45)
                void_bonus.ranged.strength_boost.append(1.025)

        return void_bonus

    @staticmethod
    def get_damage_multiplier(gear, npc, current_hp, max_hp, mining_lvl) -> float:
        if set(DHAROK_SET).issubset(gear["id"]):
            return 1 + (((max_hp - current_hp) / 100) * (max_hp / 100))

        if any(b_necklace in gear["id"] for b_necklace in BERSERKER_NECKLACE):
            if any(obsidian_weapon in gear["id"] for obsidian_weapon in OBSIDIAN_MELEE_WEAPONS):
                return 1.2

        if npc.is_shade and GADDERHAMMER in gear["id"]:
            return 1.25

        if npc.is_leafy and LEAF_BATTLE_AXE in gear["id"]:
            return 1.175

        if npc.name == "Guardian":
            for pickaxe in PICKAXES:
                if pickaxe[1] in gear["id"]:
                    return (50 + min(100, mining_lvl) + min(61, pickaxe[0])) / 150

        return 1
