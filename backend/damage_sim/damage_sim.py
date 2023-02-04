import copy

from condition_evaluator import ConditionEvaluator
from constants import MAX_SPECIAL_ATTACK, SPEC_REGEN_TICKS, SPEC_REGEN_AMOUNT, TICK_LENGTH
from input_setup.gear_ids import LIGHTBEARER
from model.boost import BoostType
from model.damage_sim_results import SingleDamageSimData
from model.npc.npc_stats import NpcStats
from weapon import Weapon


class DamageSim:
    def __init__(self, npc: NpcStats, weapon_setups: list[Weapon]):
        self.initial_combat_stats = npc.combat_stats
        self.npc = copy.deepcopy(npc)
        self.weapons_setups = weapon_setups

        self.sim_data: SingleDamageSimData = SingleDamageSimData(0, [], [], [])

        self.main_weapon: Weapon | None = None
        self.main_weapon_index = 0
        self.current_weapon: Weapon | None = None
        self.current_weapon_index = 0

        self.special_attack = 0
        self.spec_regen_tick_timer = 0
        self.ticks_to_spec_regen = []
        self.special_attack_cost = []

        self.setup_damage_sim()

    def reset(self):
        self.current_weapon = self.main_weapon
        self.current_weapon_index = 0

        self.special_attack = MAX_SPECIAL_ATTACK
        self.spec_regen_tick_timer = 0

        self.npc.combat_stats.set_stats(self.initial_combat_stats)

        self.sim_data = SingleDamageSimData(0, [], [], [])
        for index, _ in enumerate(self.weapons_setups):
            self.sim_data.gear_total_dmg.append(0)
            self.sim_data.gear_attack_count.append(0)
            self.sim_data.gear_dps.append(0)

    def run(self) -> SingleDamageSimData:
        self.reset()

        while self.npc.combat_stats.hitpoints > 0:
            self.regenerate_special_attack()
            self.current_weapon_index, self.current_weapon = self.get_next_weapon()

            damage = self.current_weapon.roll_damage()
            self.npc.combat_stats.hitpoints -= damage

            if self.current_weapon.gear_setup.is_special_attack:
                self.special_attack -= self.special_attack_cost[self.current_weapon_index]

            self.sim_data.ticks_to_kill += self.current_weapon.gear_setup.gear_stats.attack_speed
            self.sim_data.gear_total_dmg[self.current_weapon_index] += damage
            self.sim_data.gear_attack_count[self.current_weapon_index] += 1

        # remove overkill damage
        self.sim_data.gear_total_dmg[self.current_weapon_index] += self.npc.combat_stats.hitpoints
        # remove last weapon attack time
        self.sim_data.ticks_to_kill -= self.current_weapon.gear_setup.gear_stats.attack_speed

        for index, weapon in enumerate(self.weapons_setups):
            self.sim_data.gear_dps[index] = DamageSim.get_sim_dps(
                self.sim_data.gear_total_dmg[index],
                self.sim_data.gear_attack_count[index],
                weapon.gear_setup.gear_stats.attack_speed
            )

        return self.sim_data

    def get_next_weapon(self) -> tuple[int, Weapon]:
        for index, weapon in enumerate(self.weapons_setups):
            if not weapon.gear_setup.is_fill:
                continue

            use_fill_weapon = ConditionEvaluator.evaluate_condition(
                    weapon.gear_setup.conditions, self.npc.combat_stats.hitpoints,
                    self.sim_data.gear_total_dmg[self.current_weapon_index],
                    self.sim_data.gear_attack_count[self.current_weapon_index]
            )
            if use_fill_weapon:
                if (not weapon.gear_setup.is_special_attack or
                        (weapon.gear_setup.is_special_attack and
                         self.special_attack_cost[index] <= self.special_attack)):
                    return index, weapon
                else:
                    return self.main_weapon_index, self.main_weapon

        return self.main_weapon_index, self.main_weapon

    def regenerate_special_attack(self):
        if self.special_attack == MAX_SPECIAL_ATTACK:
            self.spec_regen_tick_timer = 0
            return

        self.spec_regen_tick_timer += self.current_weapon.gear_setup.gear_stats.attack_speed

        ticks_to_regen = self.ticks_to_spec_regen[self.current_weapon_index]
        if self.spec_regen_tick_timer >= ticks_to_regen:
            self.spec_regen_tick_timer -= ticks_to_regen
            self.special_attack = min(self.special_attack + SPEC_REGEN_AMOUNT, MAX_SPECIAL_ATTACK)

    def setup_damage_sim(self):
        self.main_weapon = self.weapons_setups[0]
        self.main_weapon_index = 0
        for index, weapon in enumerate(self.weapons_setups):
            if not weapon.gear_setup.is_fill:
                self.main_weapon = weapon
                self.main_weapon_index = index

            if LIGHTBEARER in weapon.gear_setup.equipped_gear.ids:
                self.ticks_to_spec_regen.append(SPEC_REGEN_TICKS / 2)
            else:
                self.ticks_to_spec_regen.append(SPEC_REGEN_TICKS)

            if any(boost == BoostType.LIQUID_ADRENALINE for boost in weapon.gear_setup.boosts):
                self.special_attack_cost.append(weapon.special_attack_cost / 2)
            else:
                self.special_attack_cost.append(weapon.special_attack_cost)

            weapon.set_npc(self.npc)

            self.sim_data.gear_total_dmg.append(0)
            self.sim_data.gear_attack_count.append(0)
            self.sim_data.gear_dps.append(0)

    @staticmethod
    def get_sim_dps(total_damage, attack_count, attack_speed):
        if attack_count == 0:
            return 0
        return total_damage / (attack_count * attack_speed * TICK_LENGTH)
