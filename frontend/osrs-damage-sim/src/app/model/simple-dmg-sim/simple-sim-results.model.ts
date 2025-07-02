export interface SimpleSimResults {
  error?: string | null;

  results: SimpleSimResult[];
}

export interface SimpleSimResult {
  averageTtk: number;
  maxTtk: number;
  minTtk: number;
  ttkHistogram: number[];
  cummulativeTtk: number[];
}
