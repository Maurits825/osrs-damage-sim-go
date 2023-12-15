import math

from model.damage_sim_results.special_proc import SpecialProc
from model.gear_setup import GearSetup
from model.hitsplat import Hitsplat
from model.input_setup.gear_setup_settings import GearSetupSettings
from model.npc.npc_stats import NpcStats
from model.stat_drain_type import StatDrainType
from model.stat_drain_weapon import StatDrainWeapon
from weapons.weapon import Weapon


class DragonWarhammer(Weapon, StatDrainWeapon):
    stat_drain_type = StatDrainType.HITS

    def __init__(self, gear_setup: GearSetup, gear_setup_settings: GearSetupSettings, npc: NpcStats, raid_level):
        super().__init__(gear_setup, gear_setup_settings, npc, raid_level)

        self.is_first_spec = True

    def reset(self):
        self.is_first_spec = True

    def get_base_max_hit(self):
        if self.gear_setup.is_special_attack:
            return math.floor(super().get_base_max_hit() * 1.5)
        else:
            return super().get_base_max_hit()

    def attack(self) -> Hitsplat:
        hitsplat = super().attack()
        if self.gear_setup.is_special_attack:
            DragonWarhammer.drain_stats(self.npc, hitsplat.damage)
        return hitsplat

    def roll_hit(self) -> bool:
        if self.is_first_spec and self.gear_setup.is_special_attack and "Tekton" in self.npc.name:
            self.is_first_spec = False
            self.hitsplat.special_procs.append(SpecialProc.DWH_TEKTON_FIRST_SPEC)
            return True

        return super().roll_hit()

    @staticmethod
    def drain_stats(npc: NpcStats, damage):
        if damage != 0:
            DragonWarhammer.drain_defence_percent(npc, 30)
        elif "Tekton" in npc.name:
            DragonWarhammer.drain_defence_percent(npc, 5)

    @staticmethod
    def drain_defence_percent(npc: NpcStats, percent):
        npc.combat_stats.defence = max(
            npc.min_defence, npc.combat_stats.defence - math.floor(npc.combat_stats.defence * (percent / 100))
        )
