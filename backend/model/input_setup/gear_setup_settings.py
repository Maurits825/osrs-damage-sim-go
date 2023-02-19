from dataclasses import dataclass

from model.boost import BoostType
from model.input_setup.stat_drain import StatDrain
from model.npc.combat_stats import CombatStats


@dataclass()
class GearSetupSettings:
    stat_drains: list[StatDrain]
    boosts: list[BoostType]
    combat_stats: CombatStats
