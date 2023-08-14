export const allStatDrains = ['Dragon warhammer', 'Bandos godsword', 'Arclight', 'Bone dagger', 'Accursed sceptre', 'Barrelchest anchor'] as const;

export type StatDrainItem = typeof allStatDrains[number];

export interface StatDrain {
  name: StatDrainItem;
  value: number;
}
