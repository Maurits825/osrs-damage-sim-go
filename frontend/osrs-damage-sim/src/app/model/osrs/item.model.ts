export interface Item {
  id: number;
  name?: string;
  icon?: string;
  attackStyles?: string[];
  attackType?: AttackType;
  specialAttackCost?: number;
  futureContent?: boolean;
}

export const allAttackTypes = ['melee', 'ranged', 'magic'] as const;

export type AttackType = typeof allAttackTypes[number];
