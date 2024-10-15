export interface Condition {
  variable: string;
  comparison: string;
  value: number;
  nextComparison: string | null;
}

export const booleanOperators = {
  AND: 'and',
  OR: 'or',
};

export const comparisonOperators = {
  EQUAL: '==',
  GRT_THAN: '>',
  LESS_THAN: '<',
  GRT_EQ_THAN: '>=',
  LESS_EQ_THAN: '<=',
};

export const conditionVariables = {
  NPC_HITPOINTS: 'Npc hitpoints',
  DMG_DEALT: 'Damage dealt',
  ATTACK_COUNT: 'Attack count',
};
