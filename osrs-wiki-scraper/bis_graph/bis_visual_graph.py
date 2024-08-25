import base64
import io
import os
from typing import List

from PIL import Image
from graphviz import Digraph

from bis_constants import Style
from wiki_data import WikiData
from bis_item import BisItem


class BisVisualGraph:
    def create_graph_image(self, bis_graph):
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
                items = WikiData.gear_slot_items[str(slot)]
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

                label_html += '<td>' + WikiData.items[item_id]["name"] + "(" + str(item_id) + ")" + '</td>'
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
            slot = WikiData.items[item_id]["slot"]
            items = WikiData.gear_slot_items[str(slot)]
            for item in items:
                if str(item["id"]) == item_id:
                    return item["icon"]
        except KeyError:
            pass
        return icon
