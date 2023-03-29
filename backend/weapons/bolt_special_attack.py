from __future__ import annotations

import copy
import math
import random

from constant import TICK_LENGTH
from model.bolt import ALL_BOLTS, Bolt, RubyBolts, DiamondBolts
from model.damage_sim_results.special_proc import SpecialProc
from model.equipped_gear import EquippedGear
from model.hitsplat import Hitsplat


class BoltSpecialAttack:

    @staticmethod
    def get_equipped_special_bolt(gear: EquippedGear, is_kandarin_diary) -> Bolt | None:
        for bolt in ALL_BOLTS:
            for bolt_id in bolt.ids:
                if bolt_id in gear.ids:
                    spec_bolt = copy.deepcopy(bolt)
                    if is_kandarin_diary:
                        spec_bolt.proc_chance = spec_bolt.proc_chance * 1.1
                    return spec_bolt

        return None

    @staticmethod
    def roll_special(bolt: Bolt, max_hit, current_hp) -> Hitsplat | None:
        hit = random.random()
        if hit <= bolt.proc_chance:
            return BoltSpecialAttack.special(bolt, max_hit, current_hp)

        return None

    @staticmethod
    def special(bolt: Bolt, max_hit, current_hp) -> Hitsplat:
        damage, max_hit = bolt.roll_damage(max_hit, current_hp)
        return Hitsplat(damage=damage, hitsplats=damage, roll_hits=True,
                        accuracy=bolt.proc_chance, max_hits=max_hit,
                        special_proc=SpecialProc(bolt.__class__.__name__))

    @staticmethod
    def get_dps(bolt: Bolt, accuracy, max_hit, attack_speed) -> float:
        if isinstance(bolt, RubyBolts):
            spec_max_hit = math.floor(500 * bolt.effect_value)
            return ((spec_max_hit * bolt.proc_chance) +
                    ((1 - bolt.proc_chance) * accuracy * max_hit * 0.5)) / (attack_speed * TICK_LENGTH)

        elif isinstance(bolt, DiamondBolts):
            spec_max_hit = math.floor(max_hit * (1 + bolt.effect_value))
            return ((spec_max_hit * bolt.proc_chance * 0.5) +
                    ((1 - bolt.proc_chance) * accuracy * max_hit * 0.5)) / (attack_speed * TICK_LENGTH)
