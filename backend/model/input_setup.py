from dataclasses import dataclass

from model.npc.npc_stats import NpcStats
from weapon import Weapon


@dataclass()
class InputSetup:
    npc: NpcStats
    all_weapons_setups: list[list[Weapon]]
