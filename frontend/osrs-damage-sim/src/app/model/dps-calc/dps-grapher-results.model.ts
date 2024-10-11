import { allStatDrains } from '../shared/stat-drain.model';

export const GraphTypes = [
  ...(allStatDrains as unknown as string[]),
  'Attack',
  'Strength',
  'Ranged',
  'Magic',
  'Npc hitpoints',
  'TOA raid level',
  'Team size',
] as const;
export type GraphType = (typeof GraphTypes)[number];

export const GraphYValues = ['dps', 'expectedHit', 'maxHit', 'accuracy'] as const;
export type GraphYValue = (typeof GraphYValues)[number];

export interface GraphData {
  label: string;
  dps: number[];
  expectedHit: number[];
  maxHit: number[];
  accuracy: number[];
}

export interface DpsGrapherResult {
  graphType: string;
  xValues: number[];
  graphData: GraphData[];
}

export interface DpsGrapherResults {
  results: DpsGrapherResult[];
}
