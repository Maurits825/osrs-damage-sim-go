from model.condition import ConditionComparison, Condition, ConditionVariables


class ConditionEvaluator:
    @staticmethod
    def evaluate_comparison(comparison: ConditionComparison, value1, value2) -> bool:
        match comparison:
            case ConditionComparison.EQUAL:
                return value1 == value2
            case ConditionComparison.GRT_THAN:
                return value1 > value2
            case ConditionComparison.LESS_THAN:
                return value1 < value2
            case ConditionComparison.GRT_EQ_THAN:
                return value1 >= value2
            case ConditionComparison.LESS_EQ_THAN:
                return value1 <= value2

    @staticmethod
    def evaluate_condition(conditions: list[Condition], npc_hitpoints, dmg_dealt):
        if len(conditions) == 0:
            return True

        bool_conditions = []

        for condition in conditions:
            match condition.variable:
                case ConditionVariables.NPC_HITPOINTS:
                    variable = npc_hitpoints
                case ConditionVariables.DMG_DEALT:
                    variable = dmg_dealt
                case _:
                    variable = 0

            bool_conditions.append(ConditionEvaluator.evaluate_comparison(condition.comparison,
                                                                          variable, condition.value))

        # TODO multiple conditions with mixed and/or doesnt make any sense, no grouping yet
        condition_result = bool_conditions[0]
        for idx, condition in enumerate(conditions[:-1]):
            condition_result = True
            match condition.nextComparison:
                case ConditionComparison.AND:
                    condition_result = condition_result and (bool_conditions[idx] and bool_conditions[idx + 1])
                case ConditionComparison.OR:
                    condition_result = condition_result and (bool_conditions[idx] or bool_conditions[idx + 1])

        return condition_result
