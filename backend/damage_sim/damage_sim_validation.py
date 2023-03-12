from __future__ import annotations

from model.stat_drain_type import StatDrainType
from weapons.custom_weapon import CUSTOM_WEAPONS

MIN_ITERATIONS = 1
MAX_ITERATIONS = 10_000

MIN_TEAM_SIZE = 1
MAX_TEAM_SIZE = 100

MIN_SETUPS = 1
MAX_SETUPS = 5

MIN_STAT_VALUE = 1
MAX_STAT_VALUE = 99

MAX_STAT_DRAIN_HITS = 100
MAX_STAT_DRAINS = 5

MAX_CONDITIONS = 5


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
        if not DamageSimValidation.is_valid_int(iterations):
            return DamageSimValidation.invalid_value_message(iterations, "iterations")

        range_error = DamageSimValidation.validate_range(iterations, MIN_ITERATIONS, MAX_ITERATIONS, "iterations")
        if range_error:
            return range_error

        team_size = global_settings["teamSize"]
        if not DamageSimValidation.is_valid_int(team_size):
            return DamageSimValidation.invalid_value_message(team_size, "team size")

        range_error = DamageSimValidation.validate_range(team_size, MIN_TEAM_SIZE, MAX_TEAM_SIZE, "team size")
        if range_error:
            return range_error

        return None

    @staticmethod
    def validate_input_gear_setups(input_gear_setups) -> str | None:
        range_error = DamageSimValidation.validate_range(len(input_gear_setups), MIN_SETUPS, MAX_SETUPS, "setups")
        if range_error:
            return range_error

        for input_gear_setup in input_gear_setups:
            if input_gear_setup["mainGearSetup"]["isSpecial"]:
                return "Main gear setup cannot use special attack"

            error = DamageSimValidation.validate_combat_stats(input_gear_setup["gearSetupSettings"]["combatStats"])
            if error:
                return error

            error = DamageSimValidation.validate_stat_drain(input_gear_setup["gearSetupSettings"]["statDrains"])
            if error:
                return error

            all_gear_setups = [input_gear_setup["mainGearSetup"], *input_gear_setup["fillGearSetups"]]
            error = DamageSimValidation.validate_gear_setups(all_gear_setups)
            if error:
                return error

            error = DamageSimValidation.validate_fill_gear_setups(input_gear_setup["fillGearSetups"])
            if error:
                return error

        return None

    @staticmethod
    def validate_fill_gear_setups(fill_gear_setups) -> str | None:
        for fill_gear_setup in fill_gear_setups:
            conditions = fill_gear_setup["conditions"]

            if len(conditions) >= MAX_CONDITIONS:
                return "Max conditions is " + str(MAX_CONDITIONS)

            for condition in conditions:
                if not DamageSimValidation.is_valid_int(condition["value"]):
                    return DamageSimValidation.invalid_value_message(condition["value"], "condition")

    @staticmethod
    def validate_gear_setups(gear_setups) -> str | None:
        for gear_setup in gear_setups:
            if not gear_setup["attackStyle"]:
                return DamageSimValidation.invalid_value_message(gear_setup["attackStyle"], "attack style")

        return None

    @staticmethod
    def validate_combat_stats(combat_stats) -> str | None:
        for stat in ["attack", "strength", "ranged", "magic", "hitpoints"]:
            stat_value = combat_stats[stat]

            if not DamageSimValidation.is_valid_int(stat_value):
                return DamageSimValidation.invalid_value_message(stat_value, stat)

            range_error = DamageSimValidation.validate_range(stat_value, MIN_STAT_VALUE, MAX_STAT_VALUE, stat)
            if range_error:
                return range_error

        return None

    @staticmethod
    def validate_stat_drain(stat_drains) -> str | None:
        if len(stat_drains) > MAX_STAT_DRAINS:
            return "Max number of stat drain is " + str(MAX_STAT_DRAINS)

        for stat_drain in stat_drains:
            drain_value = stat_drain["value"]

            if not DamageSimValidation.is_valid_int(drain_value) or drain_value <= 0:
                return DamageSimValidation.invalid_value_message(drain_value, stat_drain["name"])

            stat_drain_type = CUSTOM_WEAPONS[stat_drain["name"]].stat_drain_type
            if stat_drain_type == StatDrainType.HITS:
                if drain_value > MAX_STAT_DRAIN_HITS:
                    return "Max stat drain hits is " + str(MAX_STAT_DRAIN_HITS)

        return None

    @staticmethod
    def validate_range(value, min_value, max_value, label) -> str | None:
        if value > max_value:
            return "Max " + label + " is " + str(max_value)

        if value < min_value:
            return "Min " + label + " is " + str(min_value)

        return None

    @staticmethod
    def is_valid_int(int_value) -> bool:
        return int_value is not None and not isinstance(int_value, float)

    @staticmethod
    def invalid_value_message(value, label) -> str:
        return "Invalid value (" + str(value) + ") for " + label
