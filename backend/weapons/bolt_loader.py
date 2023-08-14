from __future__ import annotations

from model.equipped_gear import EquippedGear
from weapons.bolt_special_attack import BoltSpecialAttack
from weapons.custom_weapons.diamond_bolts import DiamondBolts
from weapons.custom_weapons.ruby_bolts import RubyBolts

RUBY_BOLTS = ([9242, 21944], RubyBolts)
DIAMOND_BOLTS = ([9243, 21946], DiamondBolts)

ALL_BOLTS = [RUBY_BOLTS, DIAMOND_BOLTS]


class BoltLoader:
    @staticmethod
    def get_equipped_special_bolt(gear: EquippedGear, is_kandarin_diary) -> BoltSpecialAttack | None:
        for bolt_ids, special_bolt in ALL_BOLTS:
            for bolt_id in bolt_ids:
                if bolt_id in gear.ids:
                    bolt = special_bolt()
                    if is_kandarin_diary:
                        bolt.proc_chance = bolt.base_proc_chance * 1.1
                    return bolt

        return None
