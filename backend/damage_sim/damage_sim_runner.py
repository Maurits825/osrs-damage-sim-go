from matplotlib.figure import Figure

from damage_sim.damage_sim import DamageSim
from damage_sim.damage_sim_graph import DamageSimGraph
from damage_sim.damage_sim_stats import DamageSimStats
from model.damage_sim_results import DamageSimResults, TotalDamageSimData
from model.input_setup import InputSetup
from weapon import Weapon


class DamageSimRunner:
    def __init__(self):
        self.damage_sim_graph = DamageSimGraph()

    def run(self, iterations, input_setup: InputSetup) -> (DamageSimResults, Figure, Figure):

        damage_sim_results = DamageSimResults([], [], [], [], [], [], [], [], {})
        ttk_tick_stats = []
        ttk_list = []
        for weapon_setups in input_setup.all_weapons_setups:
            sim_data = self.run_damage_sim(iterations, input_setup.npc, weapon_setups)

            ttk_tick_stat = DamageSimStats.populate_damage_sim_stats(
                damage_sim_results, sim_data, weapon_setups, input_setup.npc
            )
            ttk_tick_stats.append(ttk_tick_stat)

            ttk_list.append(sim_data.ticks_to_kill)

        min_ticks, max_ticks = DamageSimStats.get_min_and_max_ticks(ttk_tick_stats)

        damage_sim_results.graphs = self.damage_sim_graph.create_and_save_graphs(
            min_ticks, max_ticks, input_setup, iterations, ttk_list
        )

        return damage_sim_results

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
