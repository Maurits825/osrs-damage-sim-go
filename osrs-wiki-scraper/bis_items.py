import io
import json
from dataclasses import dataclass
from typing import Optional
from PIL import Image
import base64
from enum import Enum

from constants import CACHE_DATA_FOLDER
from generate_web_app_data import GenerateWebAppData

ITEMS_DMG_SIM_JSON = CACHE_DATA_FOLDER / "items-dmg-sim.json"
GEAR_SLOT_ITEM_JSON = CACHE_DATA_FOLDER / "gear_slot_items.json"


class Style(Enum):
    NONE = 0
    MELEE = 1
    RANGED = 2
    MAGIC = 3


STYLE_STATS = {
    Style.MELEE: ["astab", "aslash", "acrush", "str"],
    Style.RANGED: ["arange", "rstr"],
    Style.MAGIC: ["amagic", "mdmg"],
}


@dataclass()
class BisItem:
    item_id: str
    next: Optional['BisItem']


@dataclass()
class BisItemsGraph:
    items: dict[Style, dict[int, list[BisItem]]]


class GenerateBisItems:
    def __init__(self):
        self.items = None
        self.gear_slot_items = None
        self.load_items()

    def load_items(self):
        with open(ITEMS_DMG_SIM_JSON, 'r') as items_json:
            self.items = json.load(items_json)

        with open(GEAR_SLOT_ITEM_JSON, 'r') as gear_slot_items_json:
            self.gear_slot_items = json.load(gear_slot_items_json)

    def create_bis_items(self):
        seen_item_names = []
        bis_item_graph = BisItemsGraph({
            Style.MELEE: {},
            Style.RANGED: {},
            Style.MAGIC: {},
        })
        for item_id, item in self.items.items():
            if item_id == "12931":
                a = 1
            if GenerateWebAppData.is_filtered_item(item, item_id):
                continue

            if item["name"] in seen_item_names:
                continue

            if self.is_filtered_item(item, item_id):
                continue

            seen_item_names.append(item["name"])

            styles = self.get_item_style(item)
            if len(styles) == 0:
                continue

            slot = item["slot"]
            for style in styles:
                if slot not in bis_item_graph.items[style]:
                    bis_item_graph.items[style][slot] = [BisItem(item_id, None)]
                    continue

                self.insert_item_in_bis_list(style, bis_item_graph.items[style][slot], item_id)

        img = self.create_graph_image(bis_item_graph)
        img.show()

    def is_filtered_item(self, item, item_id):
        if "(perfected)" in item["name"]:
            return True
        if "(attuned)" in item["name"]:
            return True
        if "(basic)" in item["name"]:
            return True
        if any(orn_kit in item["name"] for orn_kit in ["(or)", "(g)", "(t)"]):
            return True
        return False

    def get_item_style(self, item) -> list[Style]:
        styles = []
        for style in STYLE_STATS:
            zero_or_less = 0
            for stat in STYLE_STATS[style]:
                v = item.get(stat, 0)
                if v <= 0:
                    zero_or_less += 1
            if zero_or_less != len(STYLE_STATS[style]):
                styles.append(style)

        return styles

    def insert_item_in_bis_list(self, style, items: list[BisItem], new_item_id):
        new_item = self.items[new_item_id]
        for i, bis_item in enumerate(items):
            # check if item is a direct upgrade
            true_count = 0
            item = self.items[bis_item.item_id]
            for stat in STYLE_STATS[style]:
                v = item.get(stat, 0)
                v_new = new_item.get(stat, 0)
                if v_new >= v:
                    true_count += 1
            if true_count == len(STYLE_STATS[style]):
                items[i] = BisItem(new_item_id, bis_item)
                return

            # check if item is a direct downgrade
            # since its a direct downgrade, we have to travel the linked list and insert
            if self.is_item_downgrade(style, item, new_item):
                current_bis_item = bis_item
                while current_bis_item.next is not None:
                    if self.is_item_downgrade(style, self.items[current_bis_item.next.item_id], new_item):
                        current_bis_item = current_bis_item.next
                    else:
                        break
                current_bis_item.next = BisItem(new_item_id, current_bis_item.next)
                return

        # if we reach here there are not direct up/downgrade, so this because a new node
        items.append(BisItem(new_item_id, None))

    def is_item_downgrade(self, style, item, new_item) -> bool:
        true_count = 0
        for stat in STYLE_STATS[style]:
            v = item.get(stat, 0)
            v_new = new_item.get(stat, 0)
            if v_new <= v:  # TODO same stats items will be randomly down/up grade of each other
                true_count += 1
        return true_count == len(STYLE_STATS[style])

    def create_graph_image(self, bis_graph: BisItemsGraph):
        width = 5000
        height = 5000
        final_image = Image.new('RGBA', (width, height))

        x_offset = 0
        y_offset = 0
        x_diff = 40
        y_diff = 40
        for style in [Style.MELEE]:
            for slot in bis_graph.items[style]:
                print("slot: " + str(slot))
                items = self.gear_slot_items[str(slot)]
                for bis_item in bis_graph.items[style][slot]:
                    y_offset = 0
                    while bis_item is not None:
                        icon = None
                        for item in items:
                            if str(item["id"]) == bis_item.item_id:
                                icon = item["icon"]
                        if not icon:
                            bis_item = bis_item.next
                            continue

                        try:
                            decoded_icon = base64.b64decode(icon)
                            icon = Image.open(io.BytesIO(decoded_icon))
                        except Exception:
                            bis_item = bis_item.next
                            continue

                        final_image.paste(icon, (x_offset, y_offset))
                        y_offset += y_diff

                        bis_item = bis_item.next
                    x_offset += x_diff
                x_offset += x_diff
        return final_image


if __name__ == '__main__':
    bis_items = GenerateBisItems()
    bis_items.create_bis_items()
