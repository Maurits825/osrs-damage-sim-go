import json
import unittest
from pathlib import Path

from input_setup.cox_scaling import CoxScaling
from model.input_setup.cox_scaling_input import CoxScalingInput
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
        tekton_id = 7540
        npc = WikiData.get_npc(tekton_id)

        cox_scaling_input = CoxScalingInput(1, True)
        CoxScaling.scale_npc(cox_scaling_input, npc)
        npc.combat_stats.set_stats(npc.base_combat_stats)

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
