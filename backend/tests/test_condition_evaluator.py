import unittest
from dataclasses import dataclass

from damage_sim.condition_evaluator import ConditionEvaluator
from model.condition import ConditionComparison, Condition, ConditionVariables


@dataclass()
class ComparisonData:
    comparison: ConditionComparison
    value1: int
    value2: int
    result: bool


@dataclass()
class ConditionData:
    conditions: list[Condition]
    npc_hitpoints: int
    dmg_dealt: int
    attack_count: int
    result: bool


class TestConditionEvaluator(unittest.TestCase):
    def test_evaluate_comparison(self):
        input_parameters = [
            ComparisonData(ConditionComparison.EQUAL, 0, 0, True),
            ComparisonData(ConditionComparison.GRT_THAN, 1, 0, True),
            ComparisonData(ConditionComparison.LESS_THAN, 0, 1, True),
            ComparisonData(ConditionComparison.GRT_EQ_THAN, 0, 0, True),
            ComparisonData(ConditionComparison.LESS_EQ_THAN, 0, 0, True),

        ]

        for input_parameter in input_parameters:
            with self.subTest():
                result = ConditionEvaluator.evaluate_comparison(
                    input_parameter.comparison, input_parameter.value1, input_parameter.value2
                )

                self.assertEqual(result, input_parameter.result)

    def test_evaluate_condition(self):
        input_parameters = [
            ConditionData(
                conditions=[
                    Condition(
                        variable=ConditionVariables.NPC_HITPOINTS,
                        comparison=ConditionComparison.EQUAL,
                        value=100,
                        nextComparison=None
                    )],
                npc_hitpoints=100,
                dmg_dealt=10,
                attack_count=1,
                result=True
            ),
            ConditionData(
                conditions=[
                    Condition(
                        variable=ConditionVariables.DMG_DEALT,
                        comparison=ConditionComparison.LESS_THAN,
                        value=50,
                        nextComparison=ConditionComparison.AND
                    ),
                    Condition(
                        variable=ConditionVariables.ATTACK_COUNT,
                        comparison=ConditionComparison.LESS_THAN,
                        value=1,
                        nextComparison=None
                    )
                ],
                npc_hitpoints=100,
                dmg_dealt=10,
                attack_count=2,
                result=False
            ),
            ConditionData(
                conditions=[
                    Condition(
                        variable=ConditionVariables.DMG_DEALT,
                        comparison=ConditionComparison.LESS_THAN,
                        value=50,
                        nextComparison=ConditionComparison.OR
                    ),
                    Condition(
                        variable=ConditionVariables.ATTACK_COUNT,
                        comparison=ConditionComparison.GRT_THAN,
                        value=1,
                        nextComparison=None
                    )
                ],
                npc_hitpoints=100,
                dmg_dealt=10,
                attack_count=2,
                result=True
            )
        ]

        for input_parameter in input_parameters:
            with self.subTest():
                result = ConditionEvaluator.evaluate_condition(
                    input_parameter.conditions, input_parameter.npc_hitpoints,
                    input_parameter.dmg_dealt, input_parameter.attack_count
                )
                self.assertEqual(result, input_parameter.result)


if __name__ == '__main__':
    unittest.main()
