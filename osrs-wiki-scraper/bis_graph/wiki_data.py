import json
from pathlib import Path

CACHE_DATA_FOLDER = Path("data_cache")
ITEMS_DMG_SIM_JSON = Path(__file__).parent.parent / CACHE_DATA_FOLDER / "items-dmg-sim.json"
GEAR_SLOT_ITEM_JSON = Path(__file__).parent.parent / CACHE_DATA_FOLDER / "gear_slot_items.json"


class WikiData:
    items: dict
    gear_slot_items: dict

    @staticmethod
    def load_all():
        with open(ITEMS_DMG_SIM_JSON, 'r') as items_json:
            WikiData.items = json.load(items_json)
        with open(GEAR_SLOT_ITEM_JSON, 'r') as gear_slot_items_json:
            WikiData.gear_slot_items = json.load(gear_slot_items_json)
