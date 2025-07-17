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
  detailedRuns?: DetailedRun[];
}

export interface DetailedRun {
  ttk: number;
  tickData: TickData[];
}

export interface TickData {
  tick: number;
  presetIndex: number;

  maxHit: number;
  accuracy: number;
  damage: number;

  npcHp: number;
  npcDef: number;

  specialAttack: number;
}
