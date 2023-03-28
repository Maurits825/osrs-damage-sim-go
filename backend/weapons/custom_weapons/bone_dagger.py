from model.hitsplat import Hitsplat
from model.npc.npc_stats import NpcStats
from model.stat_drain_type import StatDrainType
from model.stat_drain_weapon import StatDrainWeapon
from weapons.weapon import Weapon


class BoneDagger(Weapon, StatDrainWeapon):
    stat_drain_type = StatDrainType.DAMAGE

    def roll_damage(self) -> Hitsplat:
        hitsplat = super().roll_damage()
        if self.gear_setup.is_special_attack:
            BoneDagger.drain_stats(self.npc, hitsplat.damage)
        return hitsplat

    def get_accuracy(self):
        if self.gear_setup.is_special_attack and not self.npc.is_hit:
            return 1
        else:
            return super().get_accuracy()

    def roll_hit(self) -> bool:
        if self.gear_setup.is_special_attack and not self.npc.is_hit:
            return True

        return super().roll_hit()

    @staticmethod
    def drain_stats(npc: NpcStats, damage):
        npc.combat_stats.defence = max(npc.min_defence, npc.combat_stats.defence - damage)
