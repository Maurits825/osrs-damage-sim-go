import json
import unittest
from pathlib import Path

from gear_setup_input import GearSetupInput

TEST_RESOURCE_FOLDER = Path(__file__).parent.parent / "tests/resources"


class TestWeapon(unittest.TestCase):
    def setUp(self):
        with open(TEST_RESOURCE_FOLDER / "input_setups.json") as f:
            self.input_setups = json.load(f)

    def test_input_setups_dps(self):
        print("Testing setup dps:")
        for setup in self.input_setups:
            with self.subTest():
                input_setup = GearSetupInput.get_input_setup(self.input_setups[setup])
                dps = round(input_setup.all_weapons_setups[0][0].get_dps(), 8)

                print(setup + " - " + str(dps))
                self.assertEqual(self.input_setups[setup]["expectedDps"], dps, setup)


if __name__ == '__main__':
    unittest.main()
