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

    def test_input_setup_run_single_gear_setup(self):
        for setup_name in TestDamageSimRunner.input_setups:
            with self.subTest():
                input_setup = InputSetupConverter.get_input_setup(TestDamageSimRunner.input_setups[setup_name])

                input_setup.global_settings.iterations = TEST_ITERATIONS
                input_setup.global_settings.npc.base_combat_stats.hitpoints = NPC_HITPOINTS

                total_damage_sim_data, _, _ = DamageSimRunner.run_single_gear_setup(input_setup.global_settings,
                                                                                    input_setup.input_gear_setups[0])

                dps_sum = 0
                for dps in total_damage_sim_data.gear_dps:
                    dps_sum += dps[0]
                sim_dps_average = dps_sum / TEST_ITERATIONS
                self.assertAlmostEqual(TestDamageSimRunner.input_setups[setup_name]["expectedDps"],
                                       sim_dps_average, delta=1, msg=setup_name)

    def test_spec_input_setup_run_single_gear_setup(self):
        for setup_name in TestDamageSimRunner.spec_input_setups:
            with self.subTest():
                input_setup = InputSetupConverter.get_input_setup(TestDamageSimRunner.spec_input_setups[setup_name])

                input_setup.global_settings.iterations = TEST_ITERATIONS
                input_setup.global_settings.npc.base_combat_stats.hitpoints = NPC_HITPOINTS

                total_damage_sim_data, _, _ = DamageSimRunner.run_single_gear_setup(input_setup.global_settings,
                                                                                    input_setup.input_gear_setups[0])

                dps_sum = 0
                for dps in total_damage_sim_data.gear_dps:
                    dps_sum += dps[1]
                sim_dps_average = dps_sum / TEST_ITERATIONS
                self.assertAlmostEqual(TestDamageSimRunner.spec_input_setups[setup_name]["expectedDps"],
                                       sim_dps_average, delta=1, msg=setup_name)


if __name__ == '__main__':
    unittest.main()
