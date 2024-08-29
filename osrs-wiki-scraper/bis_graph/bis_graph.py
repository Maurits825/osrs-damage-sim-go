import json
from dataclasses import dataclass
from pathlib import Path
from typing import List

from bis_graph.bis_constants import Style, STYLE_STATS
from bis_graph.bis_item import BisItem, BisItemWalker
from bis_graph.bis_visual_graph import BisVisualGraph
from bis_graph.wiki_data import WikiData
from constants import CACHE_DATA_FOLDER, JSON_INDENT
from util import get_attack_style_and_type, is_filtered_item

BIS_GRAPH_JSON = Path(__file__).parent.parent / CACHE_DATA_FOLDER / "bis_graph.json"

# twisted, blorva, other stuff
FILTER_IDS = [
    "24664", "24666", "24668", "28254", "13199", "13197", "28256", "28258",
    "28687", "28688", "28682", "26695", "26721", "26722", "26695",
    "11705", "21276", "11706",
    "27374", "27376", "24780"
]


@dataclass()
class BisItemsGraph:
    items: dict[Style, dict[int, List[BisItem]]]


class GenerateBisItems:
    def __init__(self):
        WikiData.load_all()

    def create_bis_items(self, create_visuals=False):
        print("Creating bis graph json ...")
        seen_item_names = []
        bis_item_root = BisItemsGraph({
            Style.MELEE: {},
            Style.RANGED: {},
            Style.MAGIC: {},
        })
        bis_item_leaf = BisItemsGraph({
            Style.MELEE: {},
            Style.RANGED: {},
            Style.MAGIC: {},
        })

        for item_id, item in WikiData.items.items():
            if is_filtered_item(item, item_id):
                continue

            if item["name"] in seen_item_names:
                continue

            if self.is_bis_filtered_item(item, item_id):
                continue

            seen_item_names.append(item["name"])

            styles = self.get_item_style(item)
            if len(styles) == 0:
                continue

            slot = item["slot"]
            for style in styles:
                if slot not in bis_item_root.items[style]:
                    new_bis_item = BisItem([item_id], [], [])
                    bis_item_root.items[style][slot] = [new_bis_item]
                    bis_item_leaf.items[style][slot] = [new_bis_item]
                    continue

                BisItemWalker.insert_item(
                    bis_item_root.items[style][slot], bis_item_leaf.items[style][slot], style, item_id
                )

        if create_visuals:
            visual = BisVisualGraph()
            visual.create_graph_image(bis_item_root)

        self.save_graph_to_json(bis_item_leaf, bis_item_root)

    def save_graph_to_json(self, bis_item_leaf, bis_item_root):
        flat_graph = dict()
        for style, slot_graphs in bis_item_leaf.items.items():
            style_key = style.value
            flat_graph[style_key] = dict()
            for slot, leaves in slot_graphs.items():
                if slot == 3 or slot == 13:  # skip weapon & ammo slot
                    continue
                bis_item_queue = [item for item in leaves]
                node_id = 0
                slot_item_json = dict()
                bis_item_id = dict()
                while len(bis_item_queue) > 0:
                    current_bis_item = bis_item_queue.pop(0)
                    try:
                        next_ids = [bis_item_id[id(next_bis_item)] for next_bis_item in current_bis_item.next]
                    except KeyError:
                        bis_item_queue.append(current_bis_item)
                        continue

                    node_id += 1
                    bis_item_id[id(current_bis_item)] = str(node_id)
                    slot_item_json[node_id] = {
                        "ids": current_bis_item.item_ids,
                        "next": next_ids
                    }
                    for previous in current_bis_item.previous:
                        if previous not in bis_item_queue:
                            bis_item_queue.append(previous)

                flat_graph[style_key][slot] = {
                    "nodes": slot_item_json,
                    "roots": [bis_item_id[id(root)] for root in bis_item_root.items[style][slot]],
                }

                with open(BIS_GRAPH_JSON, 'w') as bis_json:
                    json.dump(flat_graph, bis_json, indent=JSON_INDENT)

    def is_bis_filtered_item(self, item, item_id):
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
        attack_styles, attack_type = get_attack_style_and_type(item)
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

        return list(set(styles))


if __name__ == '__main__':
    bis_items = GenerateBisItems()
    bis_items.create_bis_items()
