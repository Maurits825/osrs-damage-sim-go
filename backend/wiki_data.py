import json

import requests
from bs4 import BeautifulSoup

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
    special_attack = json.load(open("./wiki_data/special_attack.json"))

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
            location=location,
            is_kalphite=npc.get("isKalphite", False),
            is_demon=npc.get("isDemon", False),
            is_dragon=npc.get("isDragon", False),
            is_undead=npc.get("isUndead", False),
            is_leafy=npc.get("isLeafy", False),
            is_xerician=npc.get("isXerician", False),
        )

    @staticmethod
    def get_special_attack(item_name: str) -> int:
        for key in WikiData.special_attack:
            if key in item_name:
                return WikiData.special_attack[key]

        return 0

    @staticmethod
    def update_gear_slot_items_list():
        gear_slot_items = {}
        seen_item_names = []
        for item_id, item in WikiData.items_json.items():
            if item["slot"] not in gear_slot_items:
                gear_slot_items[item["slot"]] = {}

            if any(number in item["name"] for number in ["0", "25", "50", "75", "100"]):
                if any(barrows in item["name"].lower() for barrows in
                       ["ahrim", "dharok", "guthan", "karil", "torag", "verac"]):
                    continue

            if "(nz)" in item["name"]:
                continue

            if item["name"] not in seen_item_names:
                gear_slot_items[item["slot"]][int(item_id)] = {
                    "name": item["name"],
                    "id": int(item_id)
                }

                seen_item_names.append(item["name"])

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

    @staticmethod
    def update_special_attack_json():
        special_attack_dict = WikiData.get_special_attack_weapons()
        with open("./wiki_data/special_attack.json", "w") as outfile:
            json.dump(special_attack_dict, outfile)

    @staticmethod
    def get_special_attack_weapons() -> dict:
        url = 'https://oldschool.runescape.wiki/w/Special_attacks'
        response = requests.get(url)

        soup = BeautifulSoup(response.content, 'html.parser')

        all_tables = soup.findAll('table', {'class': 'wikitable'})

        weapons = {}
        weapon_names = []
        for table in all_tables:
            for row in table.find_all('tr'):
                header = row.find_all('th')
                if len(header) == 1:
                    a_links = header[0].find_all('a')
                    weapon_names = set([link.attrs['title'] for link in a_links])
                else:
                    cells = row.find_all('td')
                    try:
                        energy = cells[2].text.strip()
                        energy = energy.replace('%', '')
                        try:
                            energy = int(energy)
                        except ValueError:
                            break
                    except IndexError:
                        return weapons

                    for name in weapon_names:
                        weapons[name] = energy
                    break


if __name__ == '__main__':
    WikiData.update_gear_slot_items_list()
    WikiData.update_special_attack_json()
