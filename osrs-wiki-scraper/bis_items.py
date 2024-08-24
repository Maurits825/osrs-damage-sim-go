import base64
import io
import json
import os
from dataclasses import dataclass
from enum import Enum
from typing import List

from PIL import Image
from graphviz import Digraph

from constants import CACHE_DATA_FOLDER
from generate_web_app_data import GenerateWebAppData

ITEMS_DMG_SIM_JSON = CACHE_DATA_FOLDER / "items-dmg-sim.json"
GEAR_SLOT_ITEM_JSON = CACHE_DATA_FOLDER / "gear_slot_items.json"

# twisted, blorva, other stuff
FILTER_IDS = [
    "24664", "24666", "24668", "28254", "13199", "13197", "28256", "28258",
    "28687", "28688", "28682"
]


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
    item_ids: List[str]
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
            if item_id == "8847":  # TODO remove
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
                if style != Style.MELEE or slot != 5:
                    continue  # TODO remove

                if slot not in bis_item_graph.items[style]:
                    bis_item_graph.items[style][slot] = [BisItem([item_id], [])]
                    continue

                current_bis_item = BisItem([], bis_item_graph.items[style][slot])
                self.insert_item_in_bis_list(style, current_bis_item, item_id)

        img = self.create_graph_image(bis_item_graph)
        # img.show()

    def is_filtered_item(self, item, item_id):
        if any(i == item_id for i in FILTER_IDS):
            return True
        if "(perfected)" in item["name"]:
            return True
        if "(attuned)" in item["name"]:
            return True
        if "(basic)" in item["name"]:
            return True
        if any(orn_kit in item["name"] for orn_kit in ["(or)", "(g)", "(t)", "(cr)"]):
            return True

        if "(Deadman Mode)" in item["name"] or "(deadman)" in item["name"]:
            return True
        if "(bh)" in item["name"]:
            return True
        # some emirs arena stuff
        if "calamity" in item["name"].lower():
            return True
        if "Maoma's" in item["name"]:
            return True
        if "Koriff's" in item["name"]:
            return True
        if "Saika's" in item["name"]:
            return True
        if "(wrapped)" in item["name"]:
            return True
        if "Wristbands of the arena" in item["name"]:
            return True

        if "Ghommal's" in item["name"]:
            return True
        if "max cape" in item["name"]:
            return True
        if "slayer helmet (i)" in item["name"]:
            return True
        return False

    def get_item_style(self, item) -> list[Style]:
        styles = []
        attack_styles, attack_type = GenerateWebAppData.get_attack_style_and_type(item)
        if attack_type:
            if item.get("str", 0) < 0 or item.get("rstr", 0) < 0 or item.get("mdmg", 0) < 0:
                return []
        if attack_type == "melee":
            styles.append(Style.MELEE)
        if attack_type == "ranged":
            styles.append(Style.RANGED)
        if attack_type == "magic":
            styles.append(Style.MAGIC)

        for style in STYLE_STATS:
            zero_or_less = 0
            for stat in STYLE_STATS[style]:
                v = item.get(stat, 0)
                if v <= 0:
                    zero_or_less += 1
            if zero_or_less != len(STYLE_STATS[style]):
                styles.append(style)
            elif style in styles:
                styles.remove(style)

        return styles

    def insert_item_in_bis_list(self, style, current_bis_item: BisItem, new_item_id: str):
        new_item = self.items[new_item_id]
        upgrades: list[BisItem] = []
        downgrades: list[BisItem] = []
        exact_match: list[BisItem] = []

        def process_item(bis_item: BisItem):
            if id(bis_item) in visited:
                return
            visited.add(id(bis_item))

            # check if this item is up/down grade and add to the list
            current_item = self.items[bis_item.item_ids[0]]
            if self.compare_item(style, current_item, new_item, lambda i1, i2: i1 == i2):
                exact_match.append(bis_item)
                return  # return if exact match, no need to travel more (could actually return 'twice')
            if self.compare_item(style, current_item, new_item, lambda i1, i2: i1 >= i2):
                # have to remove 'overlapping' upgrades
                # to fully remove have to traverse the graph again...
                # or traverse graph backwards
                for up in upgrades:
                    if up in bis_item.next:
                        upgrades.remove(up)
                upgrades.append(bis_item)
                return  # if we have an upgrade, we dont need to further travel this branch
            if self.compare_item(style, current_item, new_item, lambda i1, i2: i1 <= i2):
                # have to remove previous nodes if this downgrade is in same chain
                for downgrade in downgrades:
                    if bis_item in downgrade.next:
                        downgrades.remove(downgrade)
                downgrades.append(bis_item)

            # recursively process other items
            for next_bis_item in bis_item.next:
                process_item(next_bis_item)

            return

        # recursively visit nodes
        visited = set()
        for bis_item in current_bis_item.next:
            process_item(bis_item)

        # check the lists
        if len(exact_match) == 1:
            exact_match[0].item_ids.append(new_item_id)
            return

        up_count = len(upgrades)
        down_count = len(downgrades)
        new_bis_item = BisItem([new_item_id], [])
        if up_count == 0 and down_count == 0:
            current_bis_item.next.append(new_bis_item)
            return

        # only upgrade
        if down_count == 0:
            for upgrade in upgrades:
                new_bis_item.next.append(upgrade)
            current_bis_item.next.append(new_bis_item)
            return

        # only downgrades
        if up_count == 0:
            if down_count != 1:
                pass
                # print("TODO!!")
            downgrades[-1].next.append(new_bis_item) # just do last one, wont always work
            return

        if up_count >= 1 and down_count >= 1:
            # TODO idk...
            new_bis_item.next.append(upgrades[0])
            downgrades[-1].next.append(new_bis_item) # just do last one, wont always work


    def insert_item_in_bis_list_old(self, style, current_bis_item: BisItem, new_bis_item: BisItem):
        new_item_id = new_bis_item.item_ids[0]
        new_item = self.items[new_item_id]
        while len(current_bis_item.next) > 0:
            # first lets check how many up/down grades there are
            upgrades = []
            downgrades = []
            for next_bis_item in current_bis_item.next:
                if any(new_item_id == next_id for next_id in next_bis_item.item_ids):
                    print("same id??? - should not happen")
                next_item = self.items[next_bis_item.item_ids[0]]
                if self.compare_item(style, next_item, new_item, lambda i1, i2: i1 == i2):
                    if new_item_id not in next_bis_item.item_ids:
                        next_bis_item.item_ids.append(new_item_id)
                    return
                if self.compare_item(style, next_item, new_item, lambda i1, i2: i1 >= i2):
                    upgrades.append(next_bis_item)
                if self.compare_item(style, next_item, new_item, lambda i1, i2: i1 <= i2):
                    downgrades.append(next_bis_item)

            up_count = len(upgrades)
            down_count = len(downgrades)

            # TODO this -- an item is a side grade,
            #  there could still be a direct up/downgrade item of that side grade
            # iron def is side grade of balance and a upgrade of the bronze def
            if down_count == up_count == 0:
                current_bis_item.next.append(new_bis_item)
                # TODO in this situtation there are no direct up/downgrades, so append is correct
                # although the item can still be a direct upgrade/downgrade of a next[...] item
                return
            if down_count == up_count:
                print("can this happen??")
                return

            # only upgrades
            if down_count == 0:
                for upgrade in upgrades:
                    current_bis_item.next.remove(upgrade)
                new_bis_item.next = upgrades
                current_bis_item.next.append(new_bis_item)
                return

            # only downgrades
            if up_count == 0:
                if down_count > 1:
                    # TODO???
                    print("pls dont go here")
                    for downgrade in downgrades:
                        # TODO this is scuffed, we potentially edit the same new_bis_item twice?
                        # if its on two different paths
                        self.insert_item_in_bis_list(style, downgrade, new_bis_item)
                    return
                else:
                    # only one downgrade so we travel down
                    current_bis_item = downgrades[0]
                    continue

            # mix of up and downgrades, idk
            print("TODO ....")
        current_bis_item.next.append(new_bis_item)

    def compare_item(self, style, item, new_item, compare) -> bool:
        true_count = 0
        for stat in STYLE_STATS[style]:
            v_new = new_item.get(stat, 0)
            v = item.get(stat, 0)
            if compare(v_new, v):
                true_count += 1

        attack_speed = item.get('aspeed', 0) == new_item.get('aspeed', 0)
        return true_count == len(STYLE_STATS[style]) and attack_speed

    def create_graph_image(self, bis_graph: BisItemsGraph):
        width = 5000
        height = 5000
        final_image = Image.new('RGBA', (width, height))

        x_offset = 0
        y_offset = 0
        x_diff = 40
        y_diff = 40
        for style in [Style.MELEE, Style.RANGED, Style.MAGIC]:  # TODO other styles
            for slot in bis_graph.items[style]:
                print("slot: " + str(slot))
                items = self.gear_slot_items[str(slot)]
                # bis_items = bis_graph.items[style][slot]
                self.create_spring_graph_image(bis_graph.items[style][slot],
                                               "graphs/" + str(style.name) + "_slot_" + str(slot))
        return final_image

    def create_spring_graph_image(self, items: List[BisItem], output_path: str):
        # Create a graph using graphviz
        dot = Digraph()

        img_dir = 'img'

        # Dictionary to hold item_id to BisItem mappings
        # item_dict = {item.item_id: item for item in items} # TODO remove?

        # Set to keep track of visited nodes
        visited = set()

        # Helper function to add nodes and edges
        def add_nodes_and_edges(item: BisItem):
            if item.item_ids[0] in visited:
                return
            visited.add(item.item_ids[0])

            label_html = ""
            icon_paths = []
            icons_html = ""
            for item_id in item.item_ids:
                icon_base64 = self.get_icon(item_id)
                if icon_base64 is None:
                    print("skip: " + str(item_id))
                    return

                try:
                    icon_image = Image.open(io.BytesIO(base64.b64decode(icon_base64)))
                except Exception:
                    print("skip: " + str(item_id))
                    return

                icon_path = os.path.join(img_dir, f'{item_id}.png')
                icon_paths.append(icon_path)
                icon_image.save(os.path.join("graphs", icon_path))

                label_html += '<td>' + self.items[item_id]["name"] + "(" + str(item_id) + ")" + '</td>'
                icons_html += '<td><img src="' + icon_path + '"/></td>'

            dot.node(item.item_ids[0], label=(
                    '<<table border="1" cellborder="0" cellspacing="0">'
                    '<tr>' + icons_html + '</tr>' +
                    '<tr>' + label_html + '</tr></table>>'
            ), shape='plain')

            if item.next:
                for next_item in item.next:
                    dot.edge(item.item_ids[0], next_item.item_ids[0])
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
