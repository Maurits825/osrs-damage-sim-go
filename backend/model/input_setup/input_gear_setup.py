from dataclasses import dataclass

from model.input_setup.gear_setup_settings import GearSetupSettings
from weapon import Weapon


@dataclass()
class InputGearSetup:
    gear_setup_settings: GearSetupSettings
    weapons: list[Weapon]
