export const allStatDrains = ['Dragon warhammer', 'Bandos godsword', 'Arclight'] as const;

export type StatDrainItem = typeof allStatDrains[number];

export interface StatDrain {
  name: StatDrainItem;
  value: number;
}
//prob also want a label, "hits" or "dmg", how to with type and stuff
//maybe just deifne multiple instnace of StatDrain with label...
