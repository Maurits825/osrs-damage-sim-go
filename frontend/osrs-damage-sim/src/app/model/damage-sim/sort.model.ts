export const timeSortFields = ['average', 'most_frequent', 'maximum', 'minimum', 'chance_to_kill'] as const;
export type TimeSortField = (typeof timeSortFields)[number];

export const dpsSortFields = [
  'theoreticalDps',
  'ticksToKill',
  'maxHit',
  'accuracy',
  'expectedHit',
  'attackRoll',
] as const;
export type DpsSortField = (typeof dpsSortFields)[number];

export enum SortOrder {
  Ascending = 1,
  Descending = -1,
}

export interface SortConfig {
  sortOrder: SortOrder;
  isSorted: boolean;
}

export type SortConfigs = {
  [name in TimeSortField | DpsSortField | 'targetTimeChance']: SortConfig;
};

export type SortLabels = {
  [name in TimeSortField | DpsSortField | 'targetTimeChance']: string;
};

export const sortLabels: SortLabels = {
  average: 'Average',
  most_frequent: 'Frequent',
  maximum: 'Maximum',
  minimum: 'Minimum',
  chance_to_kill: '50% Kill Chance',

  theoreticalDps: 'DPS',
  ticksToKill: 'Average TTK',
  maxHit: 'Max hit',
  accuracy: 'Accuracy',
  attackRoll: 'Attack roll',
  expectedHit: 'Expected hit',

  targetTimeChance: 'Chance',
};
