import math

from model.gear_setup import GearSetup
from model.input_setup.gear_setup_settings import GearSetupSettings
from model.leagues.trailblazer_relics import TrailblazerRelic
from model.npc.npc_stats import NpcStats
from weapons.weapon import Weapon
from wiki_data.wiki_data import WikiData


class DinhsBulwark(Weapon):  # TODO double hit on main target on spec, not in dps calc spreadsheet rn
    def __init__(self, gear_setup: GearSetup, gear_setup_settings: GearSetupSettings, npc: NpcStats, player, raid_level):
        super().__init__(gear_setup, gear_setup_settings, npc, player, raid_level)

        self.gear_setup.gear_stats.melee_strength += self.get_strength_buff()

    def get_strength_buff(self):
        defence_sum = 0
        for defence_stat in ["dstab", "dslash", "dcrush", "drange"]:
            defence_stat_value = self.get_defence_stat_sum(defence_stat)
            if TrailblazerRelic.BRAWLER_RESOLVE in self.relics:
                defence_stat_value *= 1.5
            defence_sum += defence_stat_value

        return (((defence_sum / 4) - 200) / 3) - 38

    def get_defence_stat_sum(self, key_name):
        defence_sum = 0
        for gear_id in self.gear_setup.equipped_gear.ids:
            defence_sum += WikiData.get_item(gear_id).get(key_name, 0)
        return defence_sum

    def get_attack_roll(self):
        if self.gear_setup.is_special_attack:
            return math.floor(super().get_attack_roll() * 1.2)
        else:
            return super().get_attack_roll()

    def get_npc_defence_and_style(self):
        if not self.gear_setup.is_special_attack:
            return super().get_npc_defence_and_style()

        target_defence = self.npc.combat_stats.defence
        target_defence_style = self.npc.defensive_stats.crush
        return target_defence, target_defence_style
