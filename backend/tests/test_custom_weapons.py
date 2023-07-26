import json
import unittest
from pathlib import Path

from weapons.custom_weapons.dragon_warhammer import DragonWarhammer
from wiki_data.wiki_data import WikiData

TEST_RESOURCE_FOLDER = Path(__file__).parent.parent / "tests/resources"


class TestCustomWeapons(unittest.TestCase):
    input_setups: dict
    spec_input_setups: dict

    @classmethod
    def setUpClass(cls):
        with open(TEST_RESOURCE_FOLDER / "input_setups.json") as f:
            TestCustomWeapons.input_setups = json.load(f)

        with open(TEST_RESOURCE_FOLDER / "spec_input_setups.json") as f:
            TestCustomWeapons.spec_input_setups = json.load(f)

    def test_dragon_warhammer_tekton(self):
        tekton_cm_id = 7545
        npc = WikiData.get_npc(tekton_cm_id)

        DragonWarhammer.drain_stats(npc, 0)
        self.assertEqual(234, npc.combat_stats.defence)

        DragonWarhammer.drain_stats(npc, 10)
        self.assertEqual(164, npc.combat_stats.defence)

        npc.combat_stats.set_stats(npc.base_combat_stats)

        DragonWarhammer.drain_stats(npc, 10)
        self.assertEqual(173, npc.combat_stats.defence)

        DragonWarhammer.drain_stats(npc, 10)
        self.assertEqual(122, npc.combat_stats.defence)

        npc.combat_stats.set_stats(npc.base_combat_stats)

        DragonWarhammer.drain_stats(npc, 0)
        self.assertEqual(234, npc.combat_stats.defence)

        DragonWarhammer.drain_stats(npc, 0)
        self.assertEqual(223, npc.combat_stats.defence)

        npc.combat_stats.set_stats(npc.base_combat_stats)

        DragonWarhammer.drain_stats(npc, 10)
        self.assertEqual(173, npc.combat_stats.defence)

        DragonWarhammer.drain_stats(npc, 0)
        self.assertEqual(165, npc.combat_stats.defence)


if __name__ == '__main__':
    unittest.main()
