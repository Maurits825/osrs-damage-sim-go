export interface Item {
  id: number;
  name: string;
  icon: string;
  attackStyles?: string[];
  attackType?: AttackType;
  specialAttackCost?: number;
}

export type AttackType = 'magic' | 'melee' | 'ranged';
