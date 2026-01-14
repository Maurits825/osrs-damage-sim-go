import { AttackType } from './item.model';

export const allPrayers = [
  'burst_of_strength',
  'clarity_of_thought',
  'sharp_eye',
  'mystic_will',
  'superhuman_strength',
  'improved_reflexes',
  'hawk_eye',
  'mystic_lore',
  'ultimate_strength',
  'incredible_reflexes',
  'eagle_eye',
  'mystic_might',
  'chivalry',
  'piety',
  'deadeye',
  'mystic_vigour',
  'rigour',
  'augury',
] as const;

export type Prayer = (typeof allPrayers)[number];

export type ReplacePrayer = {
  [name in Prayer]: Set<Prayer>;
};

export const DEFAULT_PRAYERS: Record<AttackType, Set<Prayer>> = {
  magic: new Set(['augury']),
  melee: new Set(['piety']),
  ranged: new Set(['rigour']),
};
