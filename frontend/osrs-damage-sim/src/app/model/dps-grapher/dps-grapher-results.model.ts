export interface DpsGraphDpsData {
  label: string;
  dps: number[];
}

export interface DpsGraphData {
  title: string;
  x_values: string[];
  x_label: string;
  dps_data: DpsGraphDpsData[];
}

export interface DpsGrapherResults {
  graph: string;
  graph_data: DpsGraphData;
  error: string;
}
