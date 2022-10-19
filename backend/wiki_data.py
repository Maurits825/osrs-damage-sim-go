import json

from model.npc.aggressive_stats import AggressiveStats
from model.npc.combat_stats import CombatStats
from model.npc.defensive_stats import DefensiveStats
from model.locations import Location
from model.npc.npc_stats import NpcStats
from model.attack_style.weapon_category import WeaponCategory
from model.weapon_stats import WeaponStats


class WikiData:
    items_json = json.load(open("./wiki_data/items-dps-calc.json"))
    npcs_json = json.load(open("./wiki_data/npcs-dps-calc.json"))
    extra_data = json.load(open("./wiki_data/extra_data.json"))
    gear_slot_items = json.load(open("./wiki_data/gear_slot_items.json"))

    @staticmethod
    def get_item(item_id: int) -> WeaponStats:
        weapon = WikiData.items_json[str(item_id)]
        weapon_category = None if weapon.get("weaponCategory", 0) == 0 else WeaponCategory[weapon["weaponCategory"]]
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
        min_defence = WikiData.extra_data["min_defence"].get(npc_name, 0)
        if npc_name in WikiData.extra_data["locations"]:
            location = Location[WikiData.extra_data["locations"][npc_name]]
        else:
            location = Location.NONE

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

    @staticmethod
    def update_gear_slot_items_list():
        gear_slot_items = {}
        for item_id, item in WikiData.items_json.items():
            if item["slot"] not in gear_slot_items:
                gear_slot_items[item["slot"]] = {}

            gear_slot_items[item["slot"]][int(item_id)] = {
                "name": item["name"],
                "id": int(item_id)
            }

        with open("./wiki_data/gear_slot_items.json", 'w') as json_file:
            json.dump(gear_slot_items, json_file)

    @staticmethod
    def get_unique_npcs():
        seen_npc_name = []
        unique_npcs = {}
        for npc_id, npc in WikiData.npcs_json.items():
            npc_key = npc["name"] + str(npc.get("combat", 0))
            if npc_key not in seen_npc_name:
                unique_npcs[npc_id] = npc
                seen_npc_name.append(npc_key)

        return unique_npcs


if __name__ == '__main__':
    WikiData.update_gear_slot_items_list()
