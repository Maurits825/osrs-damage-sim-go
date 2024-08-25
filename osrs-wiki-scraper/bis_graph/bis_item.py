from dataclasses import dataclass
from typing import List

from bis_constants import STYLE_STATS
from wiki_data import WikiData


@dataclass()
class BisItem:
    item_ids: List[str]
    previous: List['BisItem']
    next: List['BisItem']

    def __hash__(self):
        return id(self)

    def add_next(self, item: 'BisItem'):
        self.next.append(item)
        item.previous.append(self)

    def add_previous(self, item: 'BisItem'):
        self.previous.append(item)
        item.next.append(self)


@dataclass
class BisItemResult:  # TODO name???
    upgrades: list[BisItem]
    downgrades: list[BisItem]
    exact_match: BisItem | None = None


class BisItemWalker:
    @staticmethod
    def insert_item(roots: list[BisItem], leaves: list[BisItem], style, new_item_id: str):
        results = BisItemWalker.get_insert_result(roots, leaves, style, new_item_id)

        if results.exact_match:
            results.exact_match.item_ids.append(new_item_id)
            return

        up_count = len(results.upgrades)
        down_count = len(results.downgrades)

        new_bis_item = BisItem([new_item_id], [], [])
        if up_count == 0 and down_count == 0:
            roots.append(new_bis_item)
            leaves.append(new_bis_item)
            return

        # only upgrade
        if down_count == 0:
            for upgrade in results.upgrades:
                new_bis_item.add_next(upgrade)
                if upgrade in roots:
                    roots.remove(upgrade)
            roots.append(new_bis_item)
            return

        # only downgrades
        if up_count == 0:
            if down_count != 1:
                print("multiple downgrades...")  # TODO have to handle something else???
            for downgrade in results.downgrades:
                downgrade.add_next(new_bis_item)
                if downgrade in leaves:
                    leaves.remove(downgrade)
            leaves.append(new_bis_item)
            return

        if up_count == 1 and down_count == 1:
            # TODO this works????? test
            # TODO have to 'insert' this node
            upgrade = results.upgrades[0]
            downgrade = results.downgrades[0]
            for up_previous in upgrade.previous:
                if up_previous == downgrade:
                    upgrade.previous.remove(up_previous)
                    downgrade.next.remove(up_previous)
            new_bis_item.add_next(upgrade)
            downgrade.add_next(new_bis_item)

    @staticmethod
    def get_insert_result(roots: list[BisItem], leaves: list[BisItem], style, new_item_id: str) -> BisItemResult:
        # first check exact match
        new_item = WikiData.items[new_item_id]
        bis_item_stack = set([i for i in roots])
        while len(bis_item_stack) > 0:
            current_bis_item = bis_item_stack.pop()
            current_item = WikiData.items[current_bis_item.item_ids[0]]
            if BisItemWalker.compare_item(style, current_item, new_item, lambda i1, i2: i1 == i2):
                return BisItemResult([], [], current_bis_item)
            for next_bis_item in current_bis_item.next:
                bis_item_stack.add(next_bis_item)

        # if here then no exact match, check downgrades & upgrades
        bis_item_stack = set([i for i in roots])
        downgrades: list[BisItem] = []
        while len(bis_item_stack) > 0:
            current_bis_item = bis_item_stack.pop()
            current_item = WikiData.items[current_bis_item.item_ids[0]]
            if BisItemWalker.compare_item(style, current_item, new_item, lambda i1, i2: i1 <= i2):
                for downgrade in downgrades:
                    if current_bis_item in downgrade.next:
                        downgrades.remove(downgrade)
                if current_bis_item not in downgrades:
                    downgrades.append(current_bis_item)
            for next_bis_item in current_bis_item.next:
                bis_item_stack.add(next_bis_item)

        # for upgrades walk backwards starting at the leaves
        bis_item_stack = set([i for i in leaves])
        upgrades: list[BisItem] = []
        while len(bis_item_stack) > 0:
            current_bis_item = bis_item_stack.pop()
            current_item = WikiData.items[current_bis_item.item_ids[0]]
            if BisItemWalker.compare_item(style, current_item, new_item, lambda i1, i2: i1 >= i2):
                for upgrade in upgrades:
                    if current_bis_item in upgrade.previous:
                        upgrades.remove(upgrade)
                if current_bis_item not in upgrades:
                    upgrades.append(current_bis_item)
            for previous_bis_item in current_bis_item.previous:
                bis_item_stack.add(previous_bis_item)

        return BisItemResult(upgrades, downgrades)

    @staticmethod
    def compare_item(style, item, new_item, compare) -> bool:
        true_count = 0
        for stat in STYLE_STATS[style]:
            v_new = new_item.get(stat, 0)
            v = item.get(stat, 0)
            if compare(v_new, v):
                true_count += 1

        attack_speed = item.get('aspeed', 0) == new_item.get('aspeed', 0)
        return true_count == len(STYLE_STATS[style]) and attack_speed
