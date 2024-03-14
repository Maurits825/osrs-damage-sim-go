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

export interface DpsData {
  label: string;
  dps: number[];
}

export interface DpsGraphData {
  xValues: string[];
  dpsData: DpsData[];
}

export interface DpsGrapherResult {
  graphType: string;
  graphData: DpsGraphData;
}
