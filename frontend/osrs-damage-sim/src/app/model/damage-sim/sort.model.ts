export const timeSortFields = ['average', 'most_frequent', 'maximum', 'minimum', 'chance_to_kill'];
export type TimeSortField = typeof timeSortFields[number];

export enum SortOrder {
  Ascending = 1,
  Descending = -1,
}

export interface SortConfig {
  sortOrder: SortOrder;
  isSorted: boolean;
}

export type SortConfigs = {
  [name in TimeSortField]: SortConfig;
};

export type SortLabels = {
  [name in TimeSortField]: string;
};

export const sortLabels: SortLabels = {
  average: 'Average',
  most_frequent: 'Frequent',
  maximum: 'Maximum',
  minimum: 'Minimum',
  chance_to_kill: '50% Chance to kill',
};
