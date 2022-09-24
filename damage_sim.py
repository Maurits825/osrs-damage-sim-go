from gear_setup_input import GearSetupInput
from model.boost import BoostType, Boost
from model.combat_stats import CombatStats
from model.input_setup import InputSetup, GearSetup
from model.npc_stats import NpcStats
from model.prayer import Prayer
from wiki_data import WikiData


class DamageSim:
    def __init__(self):
        self.wiki_data = WikiData()

    def run_simulator(self):
        # first get inputs
        # TODO get npc by name
        npc = self.wiki_data.get_npc(11778) # Ba-ba
        # TODO better way?
        combat_stats = CombatStats(99, 99, 99, 99, 99, 99)
        # TODO as input maybe or something, list or setup names
        gear_setups = [GearSetupInput.load_gear_setup("Max Rapier")]
        # TODO boosts and prayer input
        boosts = [Boost(BoostType.SMELLING_SALTS)]
        # TODO should prayer be GearSetup specific ...
        prayers = [Prayer.PIETY]
        input_setup = InputSetup(
            npc=npc,
            combat_stats=combat_stats,
            gear_setups=gear_setups,
            boosts=boosts,
            prayers=prayers,
        )
