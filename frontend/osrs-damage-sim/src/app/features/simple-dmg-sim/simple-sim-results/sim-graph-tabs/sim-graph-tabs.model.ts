export enum GraphType {
  Cummulativettk,
  TtkHistogram,
}

export interface GraphTab {
  graphType: GraphType;
  label: string;
}

export const SIM_GRAPH_TABS: GraphTab[] = [
  { graphType: GraphType.Cummulativettk, label: 'Cummulative TTK' },
  { graphType: GraphType.TtkHistogram, label: 'TTK Histogram' },
];
