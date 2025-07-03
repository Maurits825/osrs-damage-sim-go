export enum ResultType {
  HitDist,
  DpsGraph,
  HitChance,
  CalcDetails,
}

export interface ResultTab {
  resultType: ResultType;
  label: string;
}

export const RESULT_TABS: ResultTab[] = [
  { resultType: ResultType.DpsGraph, label: 'DPS Graphs' },
  { resultType: ResultType.HitDist, label: 'Hit Distribution' },
  { resultType: ResultType.HitChance, label: 'Hit Cummulative Chance' },
];

export const CALC_DETAILS_TAB: ResultTab = {
  resultType: ResultType.CalcDetails,
  label: 'Dps Calculator Details',
};
