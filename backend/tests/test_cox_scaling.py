import json
import unittest
from pathlib import Path

from input_setup.cox_scaling import CoxScaling
from model.input_setup.cox_scaling_input import CoxScalingInput
from wiki_data.wiki_data import WikiData

TEST_RESOURCE_FOLDER = Path(__file__).parent.parent / "tests/resources"


MAX_PARTY_SIZE_TO_TEST = 5
TEKTON_ID = 7540
TEKTON_CM_ID = 7545


class TestCoxScaling(unittest.TestCase):
    cox_scaling_stats: dict

    @classmethod
    def setUpClass(cls):
        with open(TEST_RESOURCE_FOLDER / "cox_scaling.json") as f:
            TestCoxScaling.cox_scaling_stats = json.load(f)

    def test_max_stats(self):
        for npc_name in TestCoxScaling.cox_scaling_stats:
            expected_stats = TestCoxScaling.cox_scaling_stats[npc_name]["expectedStats"]
            npc_id = TestCoxScaling.cox_scaling_stats[npc_name]["id"]
            for party_size in range(1, MAX_PARTY_SIZE_TO_TEST):
                with self.subTest():
                    npc = WikiData.get_npc(npc_id)
                    cox_scaling_input = CoxScalingInput(party_size)
                    CoxScaling.scale_npc(cox_scaling_input, npc)

                    self.assertEqual(expected_stats[party_size - 1]["hitpoints"],
                                     npc.base_combat_stats.hitpoints,
                                     npc_name + str(party_size))

                    self.assertEqual(expected_stats[party_size - 1]["melee"],
                                     npc.base_combat_stats.attack,
                                     npc_name + str(party_size))

                    self.assertEqual(expected_stats[party_size - 1]["melee"],
                                     npc.base_combat_stats.strength,
                                     npc_name + str(party_size))

                    self.assertEqual(expected_stats[party_size - 1]["magic"],
                                     npc.base_combat_stats.magic,
                                     npc_name + str(party_size))

                    self.assertEqual(expected_stats[party_size - 1]["ranged"],
                                     npc.base_combat_stats.ranged,
                                     npc_name + str(party_size))

                    self.assertEqual(expected_stats[party_size - 1]["defence"],
                                     npc.base_combat_stats.defence,
                                     npc_name + str(party_size))


if __name__ == '__main__':
    unittest.main()
