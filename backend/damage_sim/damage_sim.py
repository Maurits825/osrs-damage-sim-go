from __future__ import annotations

import copy

from constant import TICK_LENGTH
from damage_sim.condition_evaluator import ConditionEvaluator
from input_setup.gear_ids import LIGHTBEARER
from model.boost import BoostType, Boost
from model.damage_sim_results.damage_sim_results import SingleDamageSimData, GearSetupDpsStats
from model.damage_sim_results.tick_data import TickData
from model.input_setup.global_settings import GlobalSettings
from model.input_setup.input_gear_setup import InputGearSetup
from model.stat_drain_type import StatDrainType
from model.stat_drain_weapon import StatDrainWeapon
from weapons.weapon import Weapon

MAIN_WEAPON_INDEX = 0

SPEC_REGEN_PER_TICK = 0.2  # 10% per 30 sec or 0.2% per tick
SPEC_REGEN_TICKS = 50
SPEC_REGEN_AMOUNT = 10
MAX_SPECIAL_ATTACK = 100


class DamageSim:
    def __init__(self, input_gear_setup: InputGearSetup, global_settings: GlobalSettings):
        self.main_weapon: Weapon = input_gear_setup.main_weapon
        self.fill_weapons: list[Weapon] = input_gear_setup.fill_weapons
        self.all_weapons: list[Weapon] = [self.main_weapon, *self.fill_weapons]
        self.gear_setup_settings = input_gear_setup.gear_setup_settings

        self.is_detailed_run = global_settings.is_detailed_run
        self.continuous_sim_settings = global_settings.continuous_sim_settings
        self.overly_draining = global_settings.overly_draining

        self.npc = self.main_weapon.npc

        self.combat_stats = self.gear_setup_settings.combat_stats
        self.initial_combat_stats = copy.deepcopy(self.combat_stats)

        self.sim_data: SingleDamageSimData = SingleDamageSimData(0, [], [], [], None)

        self.current_weapon: Weapon = self.main_weapon
        self.current_weapon_index = 0

        self.special_attack = 0
        self.spec_regen_tick_timer = 0
        self.ticks_to_spec_regen = []
        self.special_attack_cost = []

        self.has_fill_weapons = len(self.fill_weapons) != 0

        self.setup_damage_sim()

    def reset_damage_sim(self):
        self.current_weapon = self.main_weapon
        self.current_weapon_index = 0

        self.special_attack = MAX_SPECIAL_ATTACK
        self.spec_regen_tick_timer = 0

        self.reset_npc_combat_stats()
        self.combat_stats.set_stats(self.initial_combat_stats)

        self.sim_data = SingleDamageSimData(0, [], [], [], [] if self.is_detailed_run else None)
        for _, weapon in enumerate(self.all_weapons):
            self.sim_data.gear_total_dmg.append(0)
            self.sim_data.gear_attack_count.append(0)
            self.sim_data.gear_dps.append(0)

            weapon.reset()
            weapon.update_target_defence_and_roll()
            if self.is_detailed_run:
                weapon.update_accuracy()

    def reset_continuous_damage_sim(self):
        self.current_weapon = self.main_weapon
        self.current_weapon_index = 0

        self.reset_npc_combat_stats()
        self.combat_stats.set_stats(self.initial_combat_stats)

        for _, weapon in enumerate(self.all_weapons):
            weapon.update_target_defence_and_roll()
            if self.is_detailed_run:
                weapon.update_accuracy()

    def run_damage_sim(self) -> SingleDamageSimData:
        self.reset_damage_sim()
        self.sim_one_kill()
        return self.sim_data

    def run_continuous_sim(self) -> SingleDamageSimData:
        self.reset_damage_sim()

        for kill in range(self.continuous_sim_settings.kill_count):
            self.sim_one_kill()

            if self.current_weapon.gear_setup.gear_stats.attack_speed > self.continuous_sim_settings.respawn_ticks:
                wait_ticks = self.current_weapon.gear_setup.gear_stats.attack_speed
            else:
                wait_ticks = self.continuous_sim_settings.respawn_ticks

            # add respawn time or weapon cd on this kill
            self.sim_data.ticks_to_kill += wait_ticks
            self.regenerate_special_attack(wait_ticks)
            # TODO death charge

            self.reset_continuous_damage_sim()

        return self.sim_data

    def sim_one_kill(self):
        tick_data = None
        current_tick = 0

        self.current_weapon_index, self.current_weapon = self.get_next_weapon()
        while self.npc.combat_stats.hitpoints > 0:
            self.regenerate_special_attack(self.current_weapon.gear_setup.gear_stats.attack_speed)

            if self.has_fill_weapons:
                self.current_weapon_index, self.current_weapon = self.get_next_weapon()

            if self.is_detailed_run:
                tick_data = self.get_initial_tick_data(current_tick, self.npc.combat_stats.hitpoints,
                                                       self.npc.combat_stats.defence)

            hitsplat = self.current_weapon.attack()

            self.npc.combat_stats.hitpoints -= hitsplat.damage

            if self.current_weapon.gear_setup.is_special_attack:
                self.special_attack -= self.special_attack_cost[self.current_weapon_index]

            self.sim_data.ticks_to_kill += self.current_weapon.gear_setup.gear_stats.attack_speed
            self.sim_data.gear_total_dmg[self.current_weapon_index] += hitsplat.damage
            self.sim_data.gear_attack_count[self.current_weapon_index] += 1

            if (isinstance(self.current_weapon, StatDrainWeapon and Weapon) and
                    self.current_weapon.gear_setup.is_special_attack):
                for weapon in self.all_weapons:
                    weapon.update_target_defence_and_roll()
                    if self.is_detailed_run:
                        weapon.update_accuracy()

            if self.is_detailed_run and tick_data:
                DamageSim.set_tick_data_hitsplat(tick_data, hitsplat)
                self.sim_data.tick_data.append(tick_data)

            current_tick += self.current_weapon.gear_setup.gear_stats.attack_speed
            self.npc.is_hit = True

        # remove overkill damage
        self.sim_data.gear_total_dmg[self.current_weapon_index] += self.npc.combat_stats.hitpoints
        # remove last weapon attack time
        self.sim_data.ticks_to_kill -= self.current_weapon.gear_setup.gear_stats.attack_speed

        for index, weapon in enumerate(self.all_weapons):
            self.sim_data.gear_dps[index] = DamageSim.get_sim_dps(
                self.sim_data.gear_total_dmg[index],
                self.sim_data.gear_attack_count[index],
                weapon.gear_setup.gear_stats.attack_speed
            )

    def get_next_weapon(self) -> tuple[int, Weapon]:
        for index, weapon in enumerate(self.fill_weapons):
            fill_weapon_index = index + 1
            use_fill_weapon = ConditionEvaluator.evaluate_condition(
                weapon.gear_setup.conditions, self.npc.combat_stats.hitpoints,
                self.sim_data.gear_total_dmg[fill_weapon_index],
                self.sim_data.gear_attack_count[fill_weapon_index]
            )
            if use_fill_weapon:
                if (not weapon.gear_setup.is_special_attack or
                        (weapon.gear_setup.is_special_attack and
                         self.special_attack_cost[fill_weapon_index] <= self.special_attack)):
                    return fill_weapon_index, weapon
                else:
                    return MAIN_WEAPON_INDEX, self.main_weapon

        return MAIN_WEAPON_INDEX, self.main_weapon

    def regenerate_special_attack(self, ticks_passed):
        if self.special_attack == MAX_SPECIAL_ATTACK:
            self.spec_regen_tick_timer = 0
            return

        self.spec_regen_tick_timer += ticks_passed

        ticks_to_regen = self.ticks_to_spec_regen[self.current_weapon_index]
        while self.spec_regen_tick_timer >= ticks_to_regen:
            self.spec_regen_tick_timer -= ticks_to_regen
            self.special_attack = min(self.special_attack + SPEC_REGEN_AMOUNT, MAX_SPECIAL_ATTACK)

    def setup_damage_sim(self):
        Boost.apply_boosts(self.initial_combat_stats, self.gear_setup_settings.boosts)  # TODO maybe put this in weapon?
        self.combat_stats.set_stats(self.initial_combat_stats)

        self.reset_npc_combat_stats()

        self.special_attack_cost = []
        for index, weapon in enumerate(self.all_weapons):
            if LIGHTBEARER in weapon.gear_setup.equipped_gear.ids:
                self.ticks_to_spec_regen.append(SPEC_REGEN_TICKS / 2)
            else:
                self.ticks_to_spec_regen.append(SPEC_REGEN_TICKS)

            special_attack_cost = 100 if self.overly_draining else weapon.special_attack_cost
            if any(boost == BoostType.LIQUID_ADRENALINE for boost in self.gear_setup_settings.boosts):
                self.special_attack_cost.append(special_attack_cost / 2)
            else:
                self.special_attack_cost.append(special_attack_cost)

            weapon.set_combat_stats(self.combat_stats)

    def reset_npc_combat_stats(self):
        self.npc.combat_stats.set_stats(self.npc.base_combat_stats)
        self.drain_stats()
        self.npc.is_hit = False

    def drain_stats(self):
        for stat_drain in self.gear_setup_settings.stat_drains:
            if stat_drain.weapon.stat_drain_type == StatDrainType.DAMAGE:
                stat_drain.weapon.drain_stats(self.npc, stat_drain.value)
            else:
                for hit in range(stat_drain.value):
                    stat_drain.weapon.drain_stats(self.npc, 1)

    def get_weapon_dps_stats(self) -> GearSetupDpsStats:
        theoretical_dps = []
        max_hit = []
        accuracy = []
        for weapon in self.all_weapons:
            theoretical_dps.append(weapon.get_dps())
            max_hit.append(weapon.get_max_hit())
            accuracy.append(weapon.get_accuracy() * 100)

        return GearSetupDpsStats(theoretical_dps, max_hit, accuracy)

    def get_initial_tick_data(self, current_tick, npc_hp, npc_defence):
        return (
            TickData(
                tick=current_tick,
                weapon_name=self.current_weapon.gear_setup.name,
                weapon_id=self.current_weapon.gear_setup.gear_stats.id,
                is_special_attack=self.current_weapon.gear_setup.is_special_attack,
                max_hits=0,
                damage=0,
                accuracy=0,
                hitsplats=0,
                roll_hits=False,
                special_procs=[],
                npc_hitpoints=npc_hp,
                npc_defence=npc_defence,
                special_attack_amount=self.special_attack
            )
        )

    @staticmethod
    def set_tick_data_hitsplat(tick_data, hitsplat):
        tick_data.max_hits = hitsplat.max_hits.copy() if isinstance(hitsplat.max_hits, list) else hitsplat.max_hits
        tick_data.damage = hitsplat.damage
        tick_data.accuracy = hitsplat.accuracy
        tick_data.hitsplats = hitsplat.hitsplats.copy() if isinstance(hitsplat.hitsplats, list) else hitsplat.hitsplats
        tick_data.roll_hits = hitsplat.roll_hits.copy() if isinstance(hitsplat.roll_hits, list) else hitsplat.roll_hits
        tick_data.special_procs = hitsplat.special_procs.copy()

    @staticmethod
    def get_sim_dps(total_damage, attack_count, attack_speed):
        if attack_count == 0:
            return 0
        return total_damage / (attack_count * attack_speed * TICK_LENGTH)
