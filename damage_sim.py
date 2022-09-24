from damage_sim_stats import DamageSimStats
from gear_setup_input import GearSetupInput
from model.boost import BoostType, Boost
from model.combat_stats import CombatStats
from model.input_setup import InputSetup
from model.prayer import Prayer, PrayerMultiplier
from weapon import Weapon
from wiki_data import WikiData


class DamageSim:
    def __init__(self):
        self.wiki_data = WikiData()

        self.input_setup = None

    def get_input_setup(self) -> InputSetup:
        # first get inputs
        # TODO get npc by name
        npc = self.wiki_data.get_npc(11730)  # Zebak
        # TODO better way? - this is input, none boosted stats
        combat_stats = CombatStats(99, 99, 99, 99, 99, 99)
        # TODO as input maybe or something, list or setup names
        # TODO prayer input here?
        gear_setups = [GearSetupInput.load_gear_setup("Max rapier", "Lunge", [Prayer.PIETY])]
        # TODO boosts and prayer input
        boosts = [Boost(BoostType.SMELLING_SALTS)]

        # TODO calc boosted stats here?
        for boost in boosts:
            boost.apply_boost(combat_stats)

        # TODO set cmb stats,prayers & gear bonus here?
        for gear_setup in gear_setups:
            gear_setup.weapon.set_combat_stats(combat_stats)
            if gear_setup.prayers:
                gear_setup.weapon.set_prayer(PrayerMultiplier.sum_prayers(gear_setup.prayers))
            gear_setup.weapon.set_total_gear_stats(gear_setup.gear_stats)

            gear_setup.weapon.update_attack_roll()
            gear_setup.weapon.update_max_hit()

        # TODO input for this
        raid_level = 0
        path_level = 0
        return InputSetup(
            npc=npc,
            combat_stats=combat_stats,
            gear_setups=gear_setups,
            boosts=boosts,
            raid_level=raid_level,
            path_level=path_level
        )

    def run(self, iterations):
        self.input_setup = self.get_input_setup()
        tick_counts = self.run_simulator(iterations)
        stats = DamageSimStats.get_tick_count_stats(tick_counts)
        DamageSimStats.print_setup(self.input_setup.gear_setups)
        DamageSimStats.print_stats(stats)
        DamageSimStats.graph_tick_counts(tick_counts, self.input_setup.gear_setups[-1])

    def run_simulator(self, iterations):
        tick_count = []
        for i in range(iterations):
            tick_count.append(self.run_damage_sim())

        return tick_count

    def run_damage_sim(self):
        hitpoints = self.input_setup.npc.combat_stats.hitpoints
        ticks_to_kill = 0
        current_weapon_att_count = 0
        weapons_index = 0
        gear_setup = self.input_setup.gear_setups[weapons_index]
        weapon: Weapon = gear_setup.weapon
        while hitpoints > 0:
            if current_weapon_att_count >= gear_setup.attack_count:
                ticks_to_kill += current_weapon_att_count * weapon.attack_speed
                current_weapon_att_count = 0
                weapons_index += 1
                gear_setup = self.input_setup.gear_setups[weapons_index]
                weapon = gear_setup.weapon
            damage = weapon.roll_damage(hitpoints, self.input_setup.npc)
            hitpoints -= damage

            current_weapon_att_count += 1

        # TODO by default remove the last weapon att
        ticks_to_kill += (current_weapon_att_count - 1) * weapon.attack_speed
        return ticks_to_kill


sim = DamageSim()
sim.run(1000)
