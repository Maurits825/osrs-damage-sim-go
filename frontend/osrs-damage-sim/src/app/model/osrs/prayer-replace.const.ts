import { Prayer, ReplacePrayer } from './prayer.model';

export const attackPrayers: Set<Prayer> = new Set([
  'clarity_of_thought',
  'sharp_eye',
  'mystic_will',
  'improved_reflexes',
  'hawk_eye',
  'mystic_lore',
  'incredible_reflexes',
  'eagle_eye',
  'mystic_might',
  'chivalry',
  'piety',
  'rigour',
  'augury',
  'deadeye',
  'mystic_vigour',
]);

export const strengthPrayers: Set<Prayer> = new Set([
  'burst_of_strength',
  'sharp_eye',
  'mystic_will',
  'superhuman_strength',
  'hawk_eye',
  'mystic_lore',
  'ultimate_strength',
  'eagle_eye',
  'mystic_might',
  'chivalry',
  'piety',
  'rigour',
  'augury',
  'deadeye',
  'mystic_vigour',
]);

export const defencePrayers: Set<Prayer> = new Set(['chivalry', 'piety', 'rigour', 'augury']);

export const replacePrayers: ReplacePrayer = {
  burst_of_strength: strengthPrayers,
  clarity_of_thought: attackPrayers,
  sharp_eye: new Set([...attackPrayers, ...strengthPrayers]),
  mystic_will: new Set([...attackPrayers, ...strengthPrayers]),
  superhuman_strength: strengthPrayers,
  improved_reflexes: attackPrayers,
  hawk_eye: new Set([...attackPrayers, ...strengthPrayers]),
  mystic_lore: new Set([...attackPrayers, ...strengthPrayers]),
  ultimate_strength: strengthPrayers,
  incredible_reflexes: attackPrayers,
  eagle_eye: new Set([...attackPrayers, ...strengthPrayers]),
  mystic_might: new Set([...attackPrayers, ...strengthPrayers]),
  chivalry: new Set([...attackPrayers, ...strengthPrayers, ...defencePrayers]),
  piety: new Set([...attackPrayers, ...strengthPrayers, ...defencePrayers]),
  rigour: new Set([...attackPrayers, ...strengthPrayers, ...defencePrayers]),
  augury: new Set([...attackPrayers, ...strengthPrayers, ...defencePrayers]),
  deadeye: new Set([...attackPrayers, ...strengthPrayers, ...defencePrayers]),
  mystic_vigour: new Set([...attackPrayers, ...strengthPrayers, ...defencePrayers]),
};
