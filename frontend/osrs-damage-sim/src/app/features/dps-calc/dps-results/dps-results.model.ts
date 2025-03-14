export enum TabType {
  Overview,
  IndividualNpc,
}

export interface TabInfo {
  tabType: TabType;
  label: string;
}

export const RESULT_TABS: TabInfo[] = [
  { tabType: TabType.Overview, label: 'Overview' },
  { tabType: TabType.IndividualNpc, label: 'Individual' },
];

export interface BestResultsIndex {
  dps: number;
  accuracy: number;
  maxHit: number;
}
