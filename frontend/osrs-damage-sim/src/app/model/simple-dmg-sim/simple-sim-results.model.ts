export interface SimpleSimResults {
  error?: string | null;

  results: SimpleSimResult[];
}

export interface SimpleSimResult {
  averageTtk: number;
  ttkHistogram: number[];
  cummulativeTtk: number[];
}
