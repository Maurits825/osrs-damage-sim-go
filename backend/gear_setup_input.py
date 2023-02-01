import math

from constants import TOA_TEAM_SCALING, TOA_MAX_TEAM, TOB_MAX_TEAM
from gear_ids import BLOWPIPE
from model.attack_style.weapon_category import WeaponCategory
from model.boost import Boost, BoostType
from model.condition import Condition, ConditionVariables, ConditionComparison
from model.equipped_gear import EquippedGear
from model.gear_setup import GearSetup
from model.input_setup import InputSetup
from model.locations import Location
from model.npc.combat_stats import CombatStats
from model.npc.npc_stats import NpcStats
from model.prayer import Prayer
from model.weapon_stats import WeaponStats
from weapons.weapon_loader import WeaponLoader
from wiki_data import WikiData


class GearSetupInput:
    @staticmethod
    def get_input_setup(json_data) -> InputSetup:
        npc = WikiData.get_npc(json_data["npcId"])

        raid_level, path_level = GearSetupInput.get_raid_level(npc, json_data)

        if npc.is_tob_entry_mode or npc.is_tob_normal_mode or npc.is_tob_hard_mode:
            GearSetupInput.scale_tob_hp(npc, json_data)

        weapons_setups = []
        for setup in json_data["gearInputSetups"]:
            weapons = []
            for gear_setup_dict in setup:
                gear_setup = GearSetupInput.get_gear_setup(gear_setup_dict)
                weapon_item = WikiData.get_weapon(gear_setup_dict["weapon"])
                special_attack_cost = WikiData.get_special_attack(weapon_item.name)

                weapon = WeaponLoader.load_weapon(weapon_item.name, gear_setup, npc, raid_level, special_attack_cost)

                weapons.append(weapon)

            weapons_setups.append(weapons)

        return InputSetup(
            npc=npc,
            all_weapons_setups=weapons_setups,
            raid_level=raid_level,
            path_level=path_level,
        )

    @staticmethod
    def get_gear_setup(gear_setup) -> GearSetup:
        prayers = [Prayer[prayer.upper()] for prayer in gear_setup["prayers"]]

        boosts = [Boost(BoostType[boost.upper()]) for boost in gear_setup["boosts"]]
        combat_stats = CombatStats(hitpoints=gear_setup["maxHp"],
                                   attack=gear_setup["combatStats"]["attack"],
                                   strength=gear_setup["combatStats"]["strength"],
                                   defence=99,
                                   magic=gear_setup["combatStats"]["magic"],
                                   ranged=gear_setup["combatStats"]["ranged"])

        for boost in boosts:
            boost.apply_boost(combat_stats)

        gear_stats = WeaponStats(name=gear_setup["name"])
        equipped_gear = EquippedGear(gear_setup["gear"], [])
        for gear_id in gear_setup["gear"]:
            weapon_stats = WikiData.get_weapon(gear_id)
            equipped_gear.names.append(weapon_stats.name.lower())
            gear_stats += weapon_stats

        weapon_item = WikiData.get_weapon(gear_setup["weapon"])

        if weapon_item.id == BLOWPIPE:
            gear_stats.ranged_strength += WikiData.get_weapon(gear_setup["blowpipeDarts"]).ranged_strength

        gear_stats.id = weapon_item.id
        gear_stats.attack_speed = weapon_item.attack_speed

        if gear_setup["spell"]:
            attack_style = WeaponCategory.STAFF.value[3]
        else:
            attack_style = weapon_item.weapon_category.value[0]
            for style in weapon_item.weapon_category.value:
                if gear_setup["attackStyle"] == style.name:
                    attack_style = style

        conditions = [
            Condition(
                ConditionVariables[condition["variable"]],
                ConditionComparison[condition["comparison"]],
                condition["value"], ConditionComparison[condition["nextComparison"]]
            ) for condition in gear_setup["conditions"]
        ]

        return GearSetup(
            name=gear_setup["name"],
            gear_stats=gear_stats,
            attack_style=attack_style,
            spell=gear_setup["spell"],
            prayers=prayers,
            combat_stats=combat_stats,
            boosts=boosts,
            is_fill=gear_setup["isFill"],
            conditions=conditions,
            equipped_gear=equipped_gear,
            is_special_attack=gear_setup["isSpecial"],
            is_on_slayer_task=gear_setup["isOnSlayerTask"],
            is_in_wilderness=gear_setup["isInWilderness"],
            current_hp=gear_setup["currentHp"],
            mining_lvl=gear_setup["miningLvl"],
            is_kandarin_diary=gear_setup["isKandarinDiary"],
        )

    @staticmethod
    def get_raid_level(npc: NpcStats, json_data):
        raid_level = None
        path_level = None

        if npc.location == Location.TOMBS_OF_AMASCUT:
            raid_level = json_data.get("raidLevel")
            path_level = json_data.get("pathLevel")

            path_level_mult = 0.08 if path_level > 0 else 0.05
            npc.combat_stats.hitpoints = int(
                round(npc.combat_stats.hitpoints / 10 * (1 + raid_level * 0.004) *
                      (1 + (path_level - 1) * 0.05 + path_level_mult) *
                      TOA_TEAM_SCALING[min(json_data["teamSize"], TOA_MAX_TEAM) - 1], 0) * 10
            )

        return raid_level, path_level

    @staticmethod
    def scale_tob_hp(npc: NpcStats, json_data):
        team_size = min(json_data["teamSize"], TOB_MAX_TEAM)

        if team_size == 4:
            npc.combat_stats.hitpoints = math.floor(0.875 * npc.combat_stats.hitpoints)
        elif team_size in [1, 2, 3]:
            npc.combat_stats.hitpoints = math.floor(0.75 * npc.combat_stats.hitpoints)
