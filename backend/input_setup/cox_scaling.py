import math
from dataclasses import dataclass

from model.input_setup.cox_scaling_input import CoxScalingInput
from model.npc.npc_stats import NpcStats


@dataclass()
class ScaleFactors:
    player_hp: float
    player_off_def: float
    party_hp: float
    party_defence: float
    party_offence: float


@dataclass()
class CMScaleFactors:
    hp: float
    offence: float
    magic: float
    defence: float


class CoxScaling:
    @staticmethod
    def scale_npc(cox_scaling_input: CoxScalingInput, npc: NpcStats):
        if npc.is_challenge_mode and cox_scaling_input.party_size == 1:
            return
        elif npc.is_challenge_mode:
            cox_scaling_input.party_size -= 1

        scale_factors = CoxScaling.get_scale_factors(cox_scaling_input, npc)
        cm_scale_factors = CoxScaling.get_cm_scale_factors(npc)

        npc.base_combat_stats.hitpoints = CoxScaling.apply_scaling(
            npc.base_combat_stats.hitpoints,
            [scale_factors.player_hp, scale_factors.party_hp, cm_scale_factors.hp]
        )
        npc.base_combat_stats.attack = CoxScaling.apply_scaling(
            npc.base_combat_stats.attack,
            [scale_factors.player_off_def, scale_factors.party_offence, cm_scale_factors.offence]
        )
        npc.base_combat_stats.strength = CoxScaling.apply_scaling(
            npc.base_combat_stats.strength,
            [scale_factors.player_off_def, scale_factors.party_offence, cm_scale_factors.offence]
        )
        npc.base_combat_stats.magic = CoxScaling.apply_scaling(
            npc.base_combat_stats.magic,
            [scale_factors.player_off_def, scale_factors.party_offence, cm_scale_factors.magic]
        )
        npc.base_combat_stats.ranged = CoxScaling.apply_scaling(
            npc.base_combat_stats.ranged,
            [scale_factors.player_off_def, scale_factors.party_offence, cm_scale_factors.offence]
        )
        npc.base_combat_stats.defence = CoxScaling.apply_scaling(
            npc.base_combat_stats.defence,
            [scale_factors.player_off_def, scale_factors.party_defence, cm_scale_factors.defence]
        )

    @staticmethod
    def get_scale_factors(cox_scaling_input: CoxScalingInput, npc: NpcStats) -> ScaleFactors:
        player_hp = 1 if "Great Olm" in npc.name else cox_scaling_input.max_combat / 126
        player_off_def = 1 if "Great Olm" in npc.name else (math.floor(cox_scaling_input.max_hitpoints * 4/9) + 55) / 99
        party_hp = (1 if "Scavenger" in npc.name else
                    (cox_scaling_input.party_size - (3 * math.floor(cox_scaling_input.party_size / 8)) + 1)/2
                    if "Great Olm" in npc.name else
                    1 + math.floor(cox_scaling_input.party_size / 2))
        party_defence = (math.floor(math.sqrt(cox_scaling_input.party_size - 1)) +
                         math.floor((cox_scaling_input.party_size - 1) * (7 / 10)) + 100) / 100
        party_offence = (party_defence if "Abyssal portal" in npc.name else
                         (math.floor(math.sqrt(cox_scaling_input.party_size - 1)) * 7 +
                          (cox_scaling_input.party_size - 1) + 100) / 100)
        return ScaleFactors(player_hp, player_off_def, party_hp, party_defence, party_offence)

    @staticmethod
    def get_cm_scale_factors(npc: NpcStats) -> CMScaleFactors:
        if not npc.is_challenge_mode:
            return CMScaleFactors(1, 1, 1, 1)

        hp = (3 if "Great Olm" not in npc.name and "Glowing crystal" not in npc.name else 2) / 2
        offence = 1.5
        magic = (12 if "Tekton" in npc.name else 15) / 10
        defence = (12 if "Tekton" in npc.name and "Glowing crystal" not in npc.name else 15) / 10
        return CMScaleFactors(hp, offence, magic, defence)

    @staticmethod
    def apply_scaling(value, scaling_factors: list[float]) -> float:
        for scale in scaling_factors:
            value = math.floor(value * scale)
        return value

