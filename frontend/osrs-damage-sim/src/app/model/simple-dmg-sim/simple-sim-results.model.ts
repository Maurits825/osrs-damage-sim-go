export interface SimpleSimResults {
  error?: string | null;

  results: SimpleSimResult[];
}

export interface SimpleSimResult {
  ticksToKill: number;
}
