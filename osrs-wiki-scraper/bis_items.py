import base64
import io
import json
import os
from dataclasses import dataclass
from enum import Enum
from typing import List, Optional

from PIL import Image
from graphviz import Digraph

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
    next: List['BisItem']


@dataclass()
class BisItemsGraph:
    items: dict[Style, dict[int, List[BisItem]]]


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
            if item_id == "1211":
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
                    bis_item_graph.items[style][slot] = [BisItem(item_id, [])]
                    continue

                current_bis_item = BisItem("", bis_item_graph.items[style][slot])
                self.insert_item_in_bis_list(style, current_bis_item, item_id)

        img = self.create_graph_image(bis_item_graph)
        # img.show()

    def is_filtered_item(self, item, item_id):
        if "(perfected)" in item["name"]:
            return True
        if "(attuned)" in item["name"]:
            return True
        if "(basic)" in item["name"]:
            return True
        if any(orn_kit in item["name"] for orn_kit in ["(or)", "(g)", "(t)", "(cr)"]):
            return True
        if "(Deadman Mode)" in item["name"]:
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

    def insert_item_in_bis_list(self, style, current_bis_item: BisItem, new_item_id):
        new_item = self.items[new_item_id]
        while len(current_bis_item.next) > 0:
            # first lets check how many up/down grades there are
            upgrades = []
            downgrades = []
            for next_bis_item in current_bis_item.next:
                if self.is_item_upgrade(style, self.items[next_bis_item.item_id], new_item):
                    upgrades.append(next_bis_item)
                if self.is_item_downgrade(style, self.items[next_bis_item.item_id], new_item):
                    downgrades.append(next_bis_item)

            up_count = len(upgrades)
            down_count = len(downgrades)

            if down_count == up_count == 0:
                current_bis_item.next.append(BisItem(new_item_id, []))
                return
            if down_count == up_count == 1 and upgrades[0] == downgrades[0]:
                current_bis_item.next.remove(upgrades[0])
                current_bis_item.next.append(BisItem(new_item_id, upgrades))
                return

            # only upgrades
            if down_count == 0:
                if up_count == 0:
                    current_bis_item.next.append(BisItem(new_item_id, []))
                    return
                for upgrade in upgrades:
                    current_bis_item.next.remove(upgrade)
                current_bis_item.next.append(BisItem(new_item_id, upgrades))
                return

            # only downgrades
            if up_count == 0:
                if down_count > 1:
                    print("recursively go through downgrades......")
                    # here we go
                    for downgrade in downgrades:
                        self.insert_item_in_bis_list(style, downgrade, new_item_id)
                    return
                else:
                    # only one downgrade so we travel down
                    current_bis_item = downgrades[0]
                    continue

            # mix of up and downgrades, idk
            print("TODO ....")
        current_bis_item.next.append(BisItem(new_item_id, []))

    def is_item_upgrade(self, style, item, new_item) -> bool:
        true_count = 0
        for stat in STYLE_STATS[style]:
            v = item.get(stat, 0)
            v_new = new_item.get(stat, 0)
            if v_new >= v:
                true_count += 1
        return true_count == len(STYLE_STATS[style])

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
        for style in [Style.MELEE]:  # TODO other styles
            for slot in bis_graph.items[style]:
                print("slot: " + str(slot))
                if slot == 4:
                    a = 2
                items = self.gear_slot_items[str(slot)]
                # bis_items = bis_graph.items[style][slot]
                self.create_spring_graph_image(bis_graph.items[style][slot], "slot_" + str(slot))
        return final_image

    def create_spring_graph_image(self, items: List[BisItem], output_path: str):
        # Create a graph using graphviz
        dot = Digraph()

        img_dir = 'img'

        # Dictionary to hold item_id to BisItem mappings
        item_dict = {item.item_id: item for item in items}

        # Set to keep track of visited nodes
        visited = set()

        # Helper function to add nodes and edges
        def add_nodes_and_edges(item: BisItem):
            if item.item_id == "11832":
                a = 2
            if item.item_id in visited:
                return
            visited.add(item.item_id)

            # Add the node with an image placeholder
            icon_base64 = self.get_icon(item.item_id)
            if icon_base64 is None:
                print("skip: " + str(item.item_id))
                return

            try:
                icon_image = Image.open(io.BytesIO(base64.b64decode(icon_base64)))
            except Exception:
                print("skip: " + str(item.item_id))
                return

            icon_path = os.path.join(img_dir, f'{item.item_id}.png')
            icon_image.save(icon_path)  # Save the icon as a PNG file

            dot.node(item.item_id, label=item.item_id, image=icon_path, shape='rect', fontsize='10')

            if item.next:
                for next_item in item.next:
                    dot.edge(item.item_id, next_item.item_id)
                    add_nodes_and_edges(next_item)

        # Add nodes and edges for all items
        for item in items:
            add_nodes_and_edges(item)

        # Save the graph to a file
        dot.render(output_path, format='png')

    def get_icon(self, item_id):
        icon = None
        try:
            slot = self.items[item_id]["slot"]
            items = self.gear_slot_items[str(slot)]
            for item in items:
                if str(item["id"]) == item_id:
                    return item["icon"]
        except KeyError:
            pass
        return icon


if __name__ == '__main__':
    bis_items = GenerateBisItems()
    bis_items.create_bis_items()
