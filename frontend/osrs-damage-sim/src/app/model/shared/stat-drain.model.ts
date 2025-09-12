export const allStatDrains = [
  'Dragon warhammer',
  'Elder maul',
  'Bandos godsword',
  'Arclight',
  'Emberlight',
  'Bone dagger',
  'Accursed sceptre',
  'Barrelchest anchor',
  'Ralos',
  'Eye of ayak',
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
  Emberlight: 'Hits',
  'Bone dagger': 'Damage',
  'Accursed sceptre': 'Hits',
  'Barrelchest anchor': 'Damage',
  Ralos: 'Hits',
  'Eye of ayak': 'Damage',
};

export const DEFAULT_STAT_DRAIN: StatDrain = {
  name: 'Elder maul',
  value: 1,
};
