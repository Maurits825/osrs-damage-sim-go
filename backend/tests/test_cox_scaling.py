import json
import unittest
from pathlib import Path

from input_setup.cox_scaling import CoxScaling
from model.input_setup.cox_scaling_input import CoxScalingInput
from wiki_data.wiki_data import WikiData

TEST_RESOURCE_FOLDER = Path(__file__).parent.parent / "tests/resources"


MAX_PARTY_SIZE_TO_TEST = 5


class TestCoxScaling(unittest.TestCase):
    cox_scaling_stats: dict

    @staticmethod
    def format_message(npc_name, is_challenge_mode, party_size, stat_name):
        name = npc_name + " (CM)" if is_challenge_mode else npc_name
        return name + ", party size: " + str(party_size) + ", stat name: " + str(stat_name)

    @classmethod
    def setUpClass(cls):
        with open(TEST_RESOURCE_FOLDER / "cox_scaling.json") as f:
            TestCoxScaling.cox_scaling_stats = json.load(f)

    def test_max_stats(self):
        for npc_name in TestCoxScaling.cox_scaling_stats:
            expected_stats = TestCoxScaling.cox_scaling_stats[npc_name]["expectedStats"]
            npc_id = TestCoxScaling.cox_scaling_stats[npc_name]["id"]
            for party_size in range(1, MAX_PARTY_SIZE_TO_TEST):
                for is_challenge_mode in [False, True]:
                    with self.subTest():
                        npc = WikiData.get_npc(npc_id)
                        cox_scaling_input = CoxScalingInput(party_size, is_challenge_mode)
                        CoxScaling.scale_npc(cox_scaling_input, npc)

                        cox_type = "challengeMode" if is_challenge_mode else "normal"
                        self.assertEqual(expected_stats[cox_type][party_size - 1]["hitpoints"],
                                         npc.base_combat_stats.hitpoints,
                                         TestCoxScaling.format_message(npc_name, is_challenge_mode, party_size, "hitpoints"))

                        self.assertEqual(expected_stats[cox_type][party_size - 1]["melee"],
                                         npc.base_combat_stats.attack,
                                         TestCoxScaling.format_message(npc_name, is_challenge_mode, party_size, "melee attack"))

                        self.assertEqual(expected_stats[cox_type][party_size - 1]["melee"],
                                         npc.base_combat_stats.strength,
                                         TestCoxScaling.format_message(npc_name, is_challenge_mode, party_size, "melee strength"))

                        self.assertEqual(expected_stats[cox_type][party_size - 1]["magic"],
                                         npc.base_combat_stats.magic,
                                         TestCoxScaling.format_message(npc_name, is_challenge_mode, party_size, "magic"))

                        self.assertEqual(expected_stats[cox_type][party_size - 1]["ranged"],
                                         npc.base_combat_stats.ranged,
                                         TestCoxScaling.format_message(npc_name, is_challenge_mode, party_size, "ranged"))

                        self.assertEqual(expected_stats[cox_type][party_size - 1]["defence"],
                                         npc.base_combat_stats.defence,
                                         TestCoxScaling.format_message(npc_name, is_challenge_mode, party_size, "defence"))


if __name__ == '__main__':
    unittest.main()
