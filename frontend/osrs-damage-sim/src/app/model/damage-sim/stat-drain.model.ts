export const allStatDrains = [
  'Dragon warhammer',
  'Elder maul',
  'Bandos godsword',
  'Arclight',
  'Bone dagger',
  'Accursed sceptre',
  'Barrelchest anchor',
] as const;

export type StatDrainItem = (typeof allStatDrains)[number];

export interface StatDrain {
  name: StatDrainItem;
  value: number;
}

export type StatDrainLabel = {
  [name in StatDrainItem]: string;
};

export const statDrainLabels: StatDrainLabel = {
  'Dragon warhammer': 'Hits',
  'Elder maul': 'Hits',
  'Bandos godsword': 'Damage',
  Arclight: 'Hits',
  'Bone dagger': 'Damage',
  'Accursed sceptre': 'Hits',
  'Barrelchest anchor': 'Damage',
};
