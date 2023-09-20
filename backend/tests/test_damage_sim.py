import json
import unittest
from pathlib import Path

from damage_sim.damage_sim import DamageSim
from input_setup.input_setup_converter import InputSetupConverter

TEST_RESOURCE_FOLDER = Path(__file__).parent.parent / "tests/resources"


class TestDamageSim(unittest.TestCase):
    input_setups: dict
    spec_input_setups: dict

    @classmethod
    def setUpClass(cls):
        with open(TEST_RESOURCE_FOLDER / "input_setups.json") as f:
            TestDamageSim.input_setups = json.load(f)

        with open(TEST_RESOURCE_FOLDER / "spec_input_setups.json") as f:
            TestDamageSim.spec_input_setups = json.load(f)

    def test_damage_sim_single_run(self):
        for setup_name in TestDamageSim.input_setups:
            with self.subTest():
                input_setup = InputSetupConverter.get_input_setup(TestDamageSim.input_setups[setup_name])
                input_setup.global_settings.is_detailed_run = True

                damage_sim = DamageSim(input_setup.input_gear_setups[0])
                dmg_sim_data = damage_sim.run_damage_sim()

                self.assertIsNotNone(dmg_sim_data.ticks_to_kill)
                self.assertIsNotNone(dmg_sim_data.gear_total_dmg)
                self.assertIsNotNone(dmg_sim_data.gear_attack_count)
                self.assertIsNotNone(dmg_sim_data.gear_dps)

    def test_spec_damage_sim_single_run(self):
        for setup_name in TestDamageSim.spec_input_setups:
            with self.subTest():
                input_setup = InputSetupConverter.get_input_setup(TestDamageSim.spec_input_setups[setup_name])
                input_setup.global_settings.is_detailed_run = True

                damage_sim = DamageSim(input_setup.input_gear_setups[0])
                dmg_sim_data = damage_sim.run_damage_sim()

                self.assertIsNotNone(dmg_sim_data.ticks_to_kill)
                self.assertIsNotNone(dmg_sim_data.gear_total_dmg)
                self.assertIsNotNone(dmg_sim_data.gear_attack_count)
                self.assertIsNotNone(dmg_sim_data.gear_dps)


if __name__ == '__main__':
    unittest.main()
