from __future__ import annotations

from model.stat_drain_type import StatDrainType
from weapons.custom_weapons import CUSTOM_WEAPONS

MAX_ITERATIONS = 10_000
MIN_ITERATIONS = 1

MIN_TEAM_SIZE = 1

MAX_SETUPS = 5

MAX_STAT_VALUE = 99
MIN_STAT_VALUE = 1

MAX_STAT_DRAIN_HITS = 100
MAX_STAT_DRAINS = 5


class DamageSimValidation:
    @staticmethod
    def validate_setup(input_setup_json) -> str | None:
        error = DamageSimValidation.validate_global_settings(input_setup_json["globalSettings"])
        if error:
            return error

        error = DamageSimValidation.validate_input_gear_setups(input_setup_json["inputGearSetups"])
        if error:
            return error

        return None

    @staticmethod
    def validate_global_settings(global_settings) -> str | None:
        try:
            _ = global_settings["npc"]["id"]
        except (KeyError, TypeError):
            return "Invalid npc"

        iterations = global_settings["iterations"]
        if iterations > MAX_ITERATIONS:
            return "Max iterations is " + str(MAX_ITERATIONS)

        if iterations < MIN_ITERATIONS:
            return "Min iterations is " + str(MIN_ITERATIONS)

        if isinstance(iterations, float):
            return "Invalid value (" + str(iterations) + ") for iterations"

        team_size = global_settings["teamSize"]
        if team_size < MIN_TEAM_SIZE:
            return "Min team size is " + str(MIN_TEAM_SIZE)

        if isinstance(team_size, float):
            return "Invalid value (" + str(team_size) + ") for team size"

        return None

    @staticmethod
    def validate_input_gear_setups(input_gear_setups) -> str | None:
        if len(input_gear_setups) == 0:
            return "No setups"

        if len(input_gear_setups) > MAX_SETUPS:
            return "Max setups is " + str(MAX_SETUPS)

        for input_gear_setup in input_gear_setups:
            if input_gear_setup["mainGearSetup"]["isSpecial"]:
                return "Main gear setup cannot use special attack"

            error = DamageSimValidation.validate_combat_stats(input_gear_setup["gearSetupSettings"]["combatStats"])
            if error:
                return error

            error = DamageSimValidation.validate_stat_drain(input_gear_setup["gearSetupSettings"]["statDrains"])
            if error:
                return error

        return None

    @staticmethod
    def validate_combat_stats(combat_stats) -> str | None:
        for stat in ["attack", "strength", "ranged", "magic", "hitpoints"]:
            stat_value = combat_stats[stat]
            error_message = "Invalid value (" + str(stat_value) + ") for " + stat

            if not stat_value:
                return error_message

            if isinstance(stat_value, float):
                return error_message

            if not MIN_STAT_VALUE <= stat_value <= MAX_STAT_VALUE:
                return error_message

        return None

    @staticmethod
    def validate_stat_drain(stat_drains) -> str | None:
        if len(stat_drains) > MAX_STAT_DRAINS:
            return "Max number of stat drain is " + str(MAX_STAT_DRAINS)

        for stat_drain in stat_drains:
            drain_value = stat_drain["value"]

            if drain_value <= 0 or isinstance(drain_value, float):
                return "Invalid value (" + str(drain_value) + ") for " + stat_drain["name"]

            stat_drain_type = CUSTOM_WEAPONS[stat_drain["name"]].stat_drain_type
            if stat_drain_type == StatDrainType.HITS:
                if drain_value > MAX_STAT_DRAIN_HITS:
                    return "Max stat drain hits is " + str(MAX_STAT_DRAIN_HITS)

        return None
