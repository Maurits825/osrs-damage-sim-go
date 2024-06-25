export enum ResultType {
  HitDist,
  DpsGraph,
}

export interface ResultTab {
  resultType: ResultType;
  label: string;
}

export const RESULT_TABS: ResultTab[] = [
  { resultType: ResultType.DpsGraph, label: 'DPS Graphs' },
  { resultType: ResultType.HitDist, label: 'Hit Distribution' },
];
