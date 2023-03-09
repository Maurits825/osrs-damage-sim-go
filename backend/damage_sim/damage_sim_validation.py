from __future__ import annotations

MAX_ITERATIONS = 10_000
MAX_SETUPS = 5

class DamageSimValidation:
    @staticmethod
    def validate_setup(input_setup_json) -> str | None:
        try:
            _ = input_setup_json["globalSettings"]["npc"]["id"]
        except (KeyError, TypeError):
            return "Invalid npc"

        iterations = input_setup_json["globalSettings"]["iterations"]
        if iterations > MAX_ITERATIONS:
            return "Max iterations is" + str(MAX_ITERATIONS)

        if len(input_setup_json["inputGearSetups"]) == 0:
            return "No setups"

        if len(input_setup_json["inputGearSetups"]) > MAX_SETUPS:
            return "Max setups is " + str(MAX_SETUPS)

        for input_gear_setup in input_setup_json["inputGearSetups"]:
            if input_gear_setup["mainGearSetup"]["isSpecial"]:
                return "Main gear setup cannot use special attack"

        return None
