import json
import unittest
from pathlib import Path

from damage_sim.damage_sim_runner import DamageSimRunner
from input_setup.input_setup_converter import InputSetupConverter

TEST_RESOURCE_FOLDER = Path(__file__).parent.parent / "tests/resources"
TEST_ITERATIONS = 1000
NPC_HITPOINTS = 10000


class TestDamageSimRunner(unittest.TestCase):
    input_setups: dict
    spec_input_setups: dict

    @classmethod
    def setUpClass(cls):
        with open(TEST_RESOURCE_FOLDER / "input_setups.json") as f:
            TestDamageSimRunner.input_setups = json.load(f)

        with open(TEST_RESOURCE_FOLDER / "spec_input_setups.json") as f:
            TestDamageSimRunner.spec_input_setups = json.load(f)

    @staticmethod
    def print_sim_dps_diff_message(expected_dps, sim_dps, setup_name):
        dps_diff = abs(expected_dps - sim_dps)
        dps_diff_percent = (dps_diff / expected_dps) * 100

        print("dps diff: " + "{:.2f}".format(dps_diff_percent) + "%: " + setup_name)

    def test_input_setup_run_single_gear_setup(self):
        print("\nTesting setup sim dps:")
        for setup_name in TestDamageSimRunner.input_setups:
            with self.subTest():
                input_setup = InputSetupConverter.get_input_setup(TestDamageSimRunner.input_setups[setup_name])

                input_setup.global_settings.iterations = TEST_ITERATIONS
                input_setup.global_settings.is_detailed_run = False
                input_setup.global_settings.npc.base_combat_stats.hitpoints = NPC_HITPOINTS

                total_damage_sim_data, _, _ = DamageSimRunner.run_single_gear_setup(input_setup.global_settings,
                                                                                    input_setup.input_gear_setups[0])

                dps_sum = 0
                for dps in total_damage_sim_data.gear_dps:
                    dps_sum += dps[0]
                sim_dps_average = dps_sum / TEST_ITERATIONS
                self.assertAlmostEqual(TestDamageSimRunner.input_setups[setup_name]["expectedDps"],
                                       sim_dps_average, delta=1, msg=setup_name)

                TestDamageSimRunner.print_sim_dps_diff_message(
                    TestDamageSimRunner.input_setups[setup_name]["expectedDps"],
                    sim_dps_average,
                    setup_name
                )

    def test_spec_input_setup_run_single_gear_setup(self):
        print("\nTesting spec setup sim dps:")
        for setup_name in TestDamageSimRunner.spec_input_setups:
            with self.subTest():
                input_setup = InputSetupConverter.get_input_setup(TestDamageSimRunner.spec_input_setups[setup_name])

                input_setup.global_settings.iterations = TEST_ITERATIONS
                input_setup.global_settings.is_detailed_run = False
                input_setup.global_settings.npc.base_combat_stats.hitpoints = NPC_HITPOINTS
                input_setup.input_gear_setups[0].main_weapon.gear_setup.is_special_attack = True

                total_damage_sim_data, _, _ = DamageSimRunner.run_single_gear_setup(input_setup.global_settings,
                                                                                    input_setup.input_gear_setups[0])

                dps_sum = 0
                for dps in total_damage_sim_data.gear_dps:
                    dps_sum += dps[1]
                sim_dps_average = dps_sum / TEST_ITERATIONS
                self.assertAlmostEqual(TestDamageSimRunner.spec_input_setups[setup_name]["expectedDps"],
                                       sim_dps_average, delta=1, msg=setup_name)

                TestDamageSimRunner.print_sim_dps_diff_message(
                    TestDamageSimRunner.spec_input_setups[setup_name]["expectedDps"],
                    sim_dps_average,
                    setup_name
                )


if __name__ == '__main__':
    unittest.main()
