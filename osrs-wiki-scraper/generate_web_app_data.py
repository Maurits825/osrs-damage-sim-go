import base64
import json
from pathlib import Path

import requests
from bs4 import BeautifulSoup

from bis_graph.bis_item_graph import GenerateBisItems
from constants import CACHE_DATA_FOLDER, JSON_INDENT
from util import is_filtered_item, get_attack_style_and_type

NPCS_DMG_SIM_JSON = CACHE_DATA_FOLDER / "npcs-dmg-sim.json"
ITEMS_DMG_SIM_JSON = CACHE_DATA_FOLDER / "items-dmg-sim.json"
SPECIAL_ATTACK_JSON = CACHE_DATA_FOLDER / "special_attack.json"
GEAR_SLOT_ITEM_JSON = CACHE_DATA_FOLDER / "gear_slot_items.json"
UNIQUE_NPCS_JSON = CACHE_DATA_FOLDER / "unique_npcs.json"

GEAR_SLOT_ITEM_FALLBACK_JSON = Path(
    __file__).parent.parent / "frontend/osrs-damage-sim/src/assets/json_data/gear_slot_items.json"

DMM_BREACH_NPCS = ["12439", "12440", "12441", "12442", "12443", "12444", "12445", "12446", "12447", "12448", "12449",
                   "12450", "12451", "12452", "12453", "12454", "12455", "12456", "12457", "12458", "12459",
                   "13658", "13657", "13662", "13660", "12363", "13663", "13664", "13659", "13661", "13656", "10393"]

NPC_KEY_NAMES = [
    "name", "hitpoints", "att", "str", "def", "mage", "range", "attbns", "strbns", "amagic", "mbns", "arange", "rngbns",
    "dmagic", "combat", "size", "combat",
    "isTobHardMode", "isTobNormalMode", "isTobEntryMode"
]


class GenerateWebAppData:
    def __init__(self, use_gear_slot_item_json=True, verbose=0):
        self.use_gear_slot_item_json = use_gear_slot_item_json
        self.verbose = verbose

        self.npcs = None
        self.items = None

        self.special_attack = None
        self.gear_slot_items = None

        self.load_npcs()
        self.load_items()

    def load_npcs(self):
        with open(NPCS_DMG_SIM_JSON, 'r') as npcs_json:
            self.npcs = json.load(npcs_json)

    def load_items(self):
        with open(ITEMS_DMG_SIM_JSON, 'r') as items_json:
            self.items = json.load(items_json)

    def load_special_attack(self):
        with open(SPECIAL_ATTACK_JSON, 'r') as special_attack_json:
            self.special_attack = json.load(special_attack_json)

    def load_gear_slot_items(self):
        if not self.use_gear_slot_item_json:
            self.gear_slot_items = dict()
            return

        try:
            with open(GEAR_SLOT_ITEM_JSON, 'r') as gear_slot_items_json:
                self.gear_slot_items = json.load(gear_slot_items_json)
        except FileNotFoundError:
            with open(GEAR_SLOT_ITEM_FALLBACK_JSON, 'r') as gear_slot_items_json:
                self.gear_slot_items = json.load(gear_slot_items_json)

    def get_special_attack(self, item_name: str) -> int:
        for key in self.special_attack:
            if key in item_name:
                return self.special_attack[key]

        return 0

    def update_unique_npcs_json(self):
        print("Updating unique npcs json ...")
        seen_npc_name = []
        unique_npcs = []

        for npc_id, npc in self.npcs.items():
            if npc.get("hitpoints", 0) == 0:
                if self.verbose >= 3:
                    print("Filtered: " + npc["name"])
                continue

            if GenerateWebAppData.is_filtered_npc(npc, npc_id):
                if self.verbose >= 3:
                    print("Filtered: " + npc["name"])
                continue

            npc_key = self.get_npc_key(npc)
            if npc_key not in seen_npc_name:
                npc["id"] = npc_id
                unique_npcs.append(npc)
                seen_npc_name.append(npc_key)

        unique_npcs = sorted(unique_npcs, key=lambda x: x["name"])

        npcs = unique_npcs
        with open(UNIQUE_NPCS_JSON, 'w') as unique_npcs_json:
            json.dump(npcs, unique_npcs_json, indent=JSON_INDENT)

    def update_gear_slot_items_json(self):
        print("Updating gear slot items json ...")
        gear_slot_items = {}
        seen_item_names = []

        self.load_special_attack()
        self.load_gear_slot_items()
        gear_slot_items_old = self.gear_slot_items

        for item_id, item in self.items.items():
            try:
                slot = str(item["slot"])

                if slot not in gear_slot_items:
                    gear_slot_items[slot] = []

                if is_filtered_item(item, item_id):
                    if self.verbose >= 3:
                        print("Filtered: " + item["name"])
                    continue

                cached_item = GenerateWebAppData.get_cached_item(gear_slot_items_old, slot, item_id, item["name"])
                if cached_item:
                    if item["name"] not in seen_item_names:
                        gear_slot_items[slot].append(cached_item)
                        seen_item_names.append(item["name"])
                        if self.verbose >= 3:
                            print("Cached: " + item["name"])
                    continue

                if item["name"] not in seen_item_names:
                    item_dict = {
                        "name": item["name"],
                        "id": int(item_id),
                    }

                    attack_styles, attack_type, _ = get_attack_style_and_type(item)
                    if attack_styles:
                        item_dict["attackStyles"] = attack_styles
                    if attack_type:
                        item_dict["attackType"] = attack_type

                    special_attack_cost = self.get_special_attack(item["name"])
                    if special_attack_cost:
                        item_dict["specialAttackCost"] = special_attack_cost

                    item_dict["icon"] = GenerateWebAppData.get_item_encoded_image(item["name"])

                    gear_slot_items[slot].append(item_dict)
                    seen_item_names.append(item["name"])
                    if self.verbose >= 2:
                        print("Updated: " + item["name"])
            except Exception as e:
                print("Error with id: " + str(item_id) + ", name: " + item["name"])
                print(e)

        with open(GEAR_SLOT_ITEM_JSON, 'w') as json_file:
            json.dump(gear_slot_items, json_file, indent=JSON_INDENT)

    @staticmethod
    def update_special_attack_json():
        print("Updating special attack json ...")
        special_attack_dict = GenerateWebAppData.get_special_attack_weapons()
        with open(SPECIAL_ATTACK_JSON, "w") as special_attack_json:
            json.dump(special_attack_dict, special_attack_json, indent=JSON_INDENT)

    @staticmethod
    def get_npc_key(npc) -> str:
        key = ""
        for name in NPC_KEY_NAMES:
            key += str(npc.get(name, 0)) + "_"

        return key

    @staticmethod
    def get_cached_item(gear_slot_items_old, slot, item_id, item_name):
        if slot in gear_slot_items_old:
            for item in gear_slot_items_old[slot]:
                if str(item["id"]) == item_id:
                    if item_name == item["name"]:
                        return item
                    else:
                        return None

        return None

    @staticmethod
    def is_filtered_npc(npc, npc_id):
        if npc_id in DMM_BREACH_NPCS:
            return True

        return False

    @staticmethod
    def get_item_encoded_image(name):
        url_name = name.replace(' ', '_')
        url = "https://oldschool.runescape.wiki/images/" + url_name + ".png"
        url2 = "https://oldschool.runescape.wiki/images/" + url_name + "_5.png"
        try:
            response = requests.get(url)
        except Exception as e:
            print(e)
            return

        if response.status_code == 404:
            try:
                response = requests.get(url2)
            except Exception as e:
                print(e)

        img = response.content
        return base64.b64encode(img).decode('utf-8')

    @staticmethod
    def get_special_attack_weapons() -> dict:
        url = 'https://oldschool.runescape.wiki/w/Special_attacks'
        response = requests.get(url)

        soup = BeautifulSoup(response.content, 'html.parser')

        all_tables = soup.findAll('table', {'class': 'wikitable'})

        weapons = {}
        for table in all_tables:
            current_weapon_names = []
            for row in table.find_all('tr'):
                header = row.find_all('th')
                if not current_weapon_names:
                    for h in header:
                        a_link = h.find('a')
                        if a_link:
                            current_weapon_names.append(a_link.attrs['title'])
                elif current_weapon_names and "Energy" in header[0].text:
                    cells = row.find_all('td')
                    try:
                        energy = cells[0].text.strip()
                        energy = energy.replace('%', '')
                        try:
                            energy = int(energy)
                        except ValueError:
                            break
                    except IndexError:
                        continue

                    for name in current_weapon_names:
                        weapons[name] = energy
                    break

        return weapons


if __name__ == '__main__':
    GenerateWebAppData.update_special_attack_json()

    generate = GenerateWebAppData(True, 2)  # TODO add click params
    generate.update_gear_slot_items_json()
    generate.update_unique_npcs_json()

    bis_items = GenerateBisItems()
    bis_items.create_bis_items()
