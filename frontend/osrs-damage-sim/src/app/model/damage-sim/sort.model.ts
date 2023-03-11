export const timeSortFields = ['average', 'most_frequent', 'maximum', 'minimum', 'chance_to_kill'];
export type TimeSortField = typeof timeSortFields[number];

export const dpsSortFields = [
  'theoretical_dps',
  'max_hit',
  'accuracy',
  'sim_dps_stats',
  'total_damage_stats',
  'attack_count_stats',
];
export type DpsSortField = typeof timeSortFields[number];

export enum SortOrder {
  Ascending = 1,
  Descending = -1,
}

export interface SortConfig {
  sortOrder: SortOrder;
  isSorted: boolean;
}

export type SortConfigs = {
  [name in TimeSortField | DpsSortField]: SortConfig;
};

export type SortLabels = {
  [name in TimeSortField | DpsSortField]: string;
};

export const sortLabels: SortLabels = {
  average: 'Average',
  most_frequent: 'Frequent',
  maximum: 'Maximum',
  minimum: 'Minimum',
  chance_to_kill: '50% Chance to kill',

  theoretical_dps: 'DPS',
  max_hit: 'Max hit',
  accuracy: 'Accuracy',
  sim_dps_stats: 'DPS',
  total_damage_stats: 'Damage',
  attack_count_stats: 'Attack Count',
};
