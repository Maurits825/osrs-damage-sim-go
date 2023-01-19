import math

from damage_sim.damage_sim import DamageSim
from damage_sim.damage_sim_stats import DamageSimStats
from model.damage_sim_results import DamageSimResults, TotalDamageSimData
from model.input_setup import InputSetup
from weapon import Weapon


class DamageSimRunner:
    def __init__(self, show_plots=False):
        self.damage_sim_stats = DamageSimStats(show_plots)

    def run(self, iterations, input_setup: InputSetup) -> DamageSimResults:
        self.damage_sim_stats.reset_plots()

        # TODO refactor print stuff to just return text, then decide to print or just return
        max_ticks = 0
        min_ticks = math.inf
        ttk_stats_list = []
        sim_dps_stats_list = []
        total_damage_stats_list = []
        attack_count_stats_list = []
        theoretical_dps_list = []
        cumulative_chances_list = []
        for weapon_setups in input_setup.all_weapons_setups:
            sim_data = self.run_damage_sim(iterations, input_setup.npc, weapon_setups)

            ttk_stats = DamageSimStats.get_data_stats(
                sim_data.ticks_to_kill, DamageSimStats.get_weapon_setup_label(weapon_setups)
            )
            ttk_stats_list.append(DamageSimStats.get_ticks_stats(ttk_stats))

            sim_dps_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_dps, weapon_setups)
            sim_dps_stats_list.append(sim_dps_stats)

            total_damage_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_total_dmg, weapon_setups)
            total_damage_stats_list.append(total_damage_stats)

            attack_count_stats = DamageSimStats.get_data_2d_stats(sim_data.gear_attack_count, weapon_setups)
            attack_count_stats_list.append(attack_count_stats)

            cumulative_chances_list.append(list(DamageSimStats.get_cumulative_sum(sim_data.ticks_to_kill)))

            theoretical_dps = []
            for weapon in weapon_setups:
                weapon.set_npc(input_setup.npc)
                theoretical_dps.append(weapon.get_dps())

            DamageSimStats.print_setup(weapon_setups, total_damage_stats)
            theoretical_dps_list.append(theoretical_dps)

            for idx, dps in enumerate(sim_dps_stats):
                DamageSimStats.print_stats(dps, weapon_setups[idx].gear_setup.name + " Sim DPS")
            DamageSimStats.print_ticks_stats(ttk_stats, "Time")
            print("")

            max_ticks = max(max_ticks, ttk_stats.maximum)
            min_ticks = min(min_ticks, ttk_stats.minimum)
            self.damage_sim_stats.graph_n_cumulative_tick_count(sim_data.ticks_to_kill, weapon_setups)

        figure = self.damage_sim_stats.show_cumulative_graph(min_ticks, max_ticks, input_setup, iterations,
                                                             input_setup.npc.combat_stats.hitpoints)

        return DamageSimResults(ttk_stats_list, total_damage_stats_list, attack_count_stats_list, sim_dps_stats_list,
                                theoretical_dps_list, cumulative_chances_list, figure)

    def run_damage_sim(self, iterations, npc, weapon_setups: list[Weapon]) -> TotalDamageSimData:
        total_damage_sim_data = TotalDamageSimData([], [], [], [])
        damage_sim = DamageSim(npc, weapon_setups)
        for i in range(iterations):
            dmg_sim_data = damage_sim.run()
            total_damage_sim_data.ticks_to_kill.append(dmg_sim_data.ticks_to_kill)
            total_damage_sim_data.gear_total_dmg.append(dmg_sim_data.gear_total_dmg)
            total_damage_sim_data.gear_attack_count.append(dmg_sim_data.gear_attack_count)
            total_damage_sim_data.gear_dps.append(dmg_sim_data.gear_dps)
        return total_damage_sim_data
