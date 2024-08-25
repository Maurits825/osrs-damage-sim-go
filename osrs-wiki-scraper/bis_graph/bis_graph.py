from dataclasses import dataclass
from typing import List

from bis_constants import Style, STYLE_STATS
from bis_item import BisItem, BisItemWalker
from bis_visual_graph import BisVisualGraph
from generate_web_app_data import GenerateWebAppData
from wiki_data import WikiData

# twisted, blorva, other stuff
FILTER_IDS = [
    "24664", "24666", "24668", "28254", "13199", "13197", "28256", "28258",
    "28687", "28688", "28682"
]


@dataclass()
class BisItemsGraph:
    items: dict[Style, dict[int, List[BisItem]]]


class GenerateBisItems:
    def __init__(self):
        WikiData.load_all()  # TODO kinda scuffed but to have global static wiki data

    def create_bis_items(self):
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
            if item_id == "12608":  # TODO remove
                print(item_id)
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

                if slot not in bis_item_root.items[style]:
                    new_bis_item = BisItem([item_id], [], [])
                    bis_item_root.items[style][slot] = [new_bis_item]
                    bis_item_leaf.items[style][slot] = [new_bis_item]
                    continue

                # root_bis_items = BisItem([], [], bis_item_graph.items[style][slot])
                # leaf_bis_items = BisItem([], bis_item_leaf.items[style][slot], [])
                BisItemWalker.insert_item(
                    bis_item_root.items[style][slot], bis_item_leaf.items[style][slot], style, item_id
                )

        visual = BisVisualGraph()
        visual.create_graph_image(bis_item_root)

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


if __name__ == '__main__':
    bis_items = GenerateBisItems()
    bis_items.create_bis_items()
