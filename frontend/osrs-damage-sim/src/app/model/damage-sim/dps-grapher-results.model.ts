import { allStatDrains } from './stat-drain.model';

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

export interface DpsGraphData {
  label: string;
  dps: number[];
}

export interface DpsGrapherResult {
  graphType: string;
  xValues: string[];
  dpsData: DpsGraphData[];
}

export interface DpsGrapherResults {
  title: string;
  results: DpsGrapherResult[];
}
