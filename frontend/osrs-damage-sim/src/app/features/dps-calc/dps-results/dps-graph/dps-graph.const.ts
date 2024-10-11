import { GraphType } from 'src/app/model/dps-calc/dps-grapher-results.model';

export const graphTypeOrder: { [key: GraphType]: number } = {
  'Elder maul': 1,
  'Bandos godsword': 2,
  'Dragon warhammer': 3,
  Arclight: 4,
  Emberlight: 5,
  'Bone dagger': 6,
  'Accursed sceptre': 7,
  'Barrelchest anchor': 8,
  Ralos: 9,
  Attack: 10,
  Strength: 11,
  Ranged: 12,
  Magic: 13,
  'Npc hitpoints': 14,
  'TOA raid level': 15,
  'Team size': 16,
};

export const graphYLabel: { [key: string]: string } = {
  dps: 'Dps',
  expectedHit: 'Expected Hit',
  maxHit: 'Max Hit',
  accuracy: 'Accuracy',
};
