from dataclasses import dataclass

from model.npc.npc_stats import NpcStats
from weapon import Weapon


@dataclass()
class GlobalSettings:
    npc: NpcStats

    raid_level: int
    path_level: int

    team_size: int
    iterations: int


@dataclass()
class InputSetup:
    global_settings: GlobalSettings
    all_weapons_setups: list[list[Weapon]]

