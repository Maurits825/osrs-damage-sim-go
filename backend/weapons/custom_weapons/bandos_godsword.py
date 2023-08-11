import math

from model.hitsplat import Hitsplat
from model.npc.npc_stats import NpcStats
from model.stat_drain_type import StatDrainType
from model.stat_drain_weapon import StatDrainWeapon
from weapons.weapon import Weapon


class BandosGodsword(Weapon, StatDrainWeapon):
    stat_drain_type = StatDrainType.DAMAGE

    def get_max_hit(self) -> int | list[int]:
        max_hit = super().get_max_hit()
        if self.gear_setup.is_special_attack:
            return math.floor(math.floor(max_hit * 1.1) * 1.1)
        else:
            return max_hit

    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return 2 * super().get_attack_roll()
        else:
            return super().get_attack_roll()

    def get_npc_defence_and_style(self):
        if not self.gear_setup.is_special_attack:
            return super().get_npc_defence_and_style()

        target_defence = self.npc.combat_stats.defence
        # always roll against slash
        target_defence_style = self.npc.defensive_stats.slash
        return target_defence, target_defence_style

    def attack(self) -> Hitsplat:
        hitsplat = super().attack()
        if self.gear_setup.is_special_attack:
            BandosGodsword.drain_stats(self.npc, hitsplat.damage)

        return hitsplat

    def roll_hit(self) -> bool:
        roll_hit = super().roll_hit()
        if not roll_hit and "Tekton" in self.npc.name:
            BandosGodsword.drain_stats(self.npc, 10)
        return roll_hit

    @staticmethod
    def drain_stats(npc: NpcStats, damage):
        npc.combat_stats.defence = max(npc.min_defence, npc.combat_stats.defence - damage)
