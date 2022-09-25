import json

from model.aggressive_stats import AggressiveStats
from model.combat_stats import CombatStats
from model.defensive_stats import DefensiveStats
from model.locations import Location
from model.npc_stats import NpcStats
from model.weapon_category import WeaponCategory
from model.weapon_stats import WeaponStats


class WikiData:
    items_json = json.load(open("./wiki_data/items-dps-calc.json"))
    npcs_json = json.load(open("./wiki_data/npcs-dps-calc.json"))
    min_defence = json.load(open("./wiki_data/min_defence.json"))
    locations = json.load(open("./wiki_data/locations.json"))

    @staticmethod
    def get_item(item_id: int) -> WeaponStats:
        weapon = WikiData.items_json[str(item_id)]
        weapon_category = None if weapon.get("weaponCategory", 0) == 0 else WeaponCategory[weapon.get("weaponCategory", 0)]
        return WeaponStats(
            name=weapon.get("name", 0),
            id=weapon.get("id", item_id),
            attack_speed=weapon.get("aspeed", 0),
            stab=weapon.get("astab", 0),
            slash=weapon.get("aslash", 0),
            crush=weapon.get("acrush", 0),
            magic=weapon.get("amagic", 0),
            ranged=weapon.get("arange", 0),
            melee_strength=weapon.get("str", 0),
            ranged_strength=weapon.get("rstr", 0),
            magic_strength=weapon.get("mdmg", 0),
            weapon_category=weapon_category,
        )

    @staticmethod
    def get_npc(npc_id: int) -> NpcStats:
        npc = WikiData.npcs_json[str(npc_id)]
        npc_name = npc["name"]
        min_defence = WikiData.min_defence.get(npc_name, 0)
        location = WikiData.locations.get(npc_name, Location.NONE)

        return NpcStats(
            name=npc_name,
            combat_stats=CombatStats(
                hitpoints=npc.get("hitpoints", 0),
                attack=npc.get("att", 0),
                strength=npc.get("str", 0),
                defence=npc.get("def", 0),
                magic=npc.get("mage", 0),
                ranged=npc.get("range", 0),
            ),
            aggressive_stats=AggressiveStats(
                attack=npc.get("attbns", 0),
                magic=npc.get("amagic", 0),
                ranged=npc.get("arange", 0),
                melee_strength=npc.get("strbns", 0),
                ranged_strength=npc.get("rngbns", 0),
                magic_strength=npc.get("mbns", 0),
            ),
            defensive_stats=DefensiveStats(
                stab=npc.get("dstab", 0),
                slash=npc.get("dslash", 0),
                crush=npc.get("dcrush", 0),
                magic=npc.get("dmagic", 0),
                ranged=npc.get("drange", 0),
            ),
            min_defence=min_defence,
            location=location
        )
