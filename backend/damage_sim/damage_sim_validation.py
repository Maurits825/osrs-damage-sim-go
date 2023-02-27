MAX_ITERATIONS = 10_000


class DamageSimValidation:
    @staticmethod
    def validate_setup(input_setup_json) -> bool:
        try:
            npc_id = input_setup_json["globalSettings"]["npc"]["id"]
        except (KeyError, TypeError):
            return False

        iterations = input_setup_json["globalSettings"]["iterations"]
        if iterations > MAX_ITERATIONS:
            return False

        return True
