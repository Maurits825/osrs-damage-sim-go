from dataclasses import dataclass

from model.npc.npc_stats import NpcStats


@dataclass()
class GlobalSettings:
    npc: NpcStats

    team_size: int
    iterations: int

    raid_level: int
    path_level: int

    is_cox_challenge_mode: bool

    is_detailed_run: bool = False
