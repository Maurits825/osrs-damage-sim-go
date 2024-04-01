import { DpsGrapherResults } from './dps-grapher-results.model';

export interface InputGearSetupLabels {
  gearSetupSettingsLabel: string;
  gearSetupName: string;
}

export interface DpsCalcResult {
  error?: string | null;

  labels: InputGearSetupLabels;
  theoreticalDps: number;
  maxHit: number[];
  accuracy: number;
  hitDist: number[];
  calcDetails?: string[];
}

export interface DpsCalcResults {
  title: string;
  results: DpsCalcResult[];
}

export interface DpsResults {
  error?: string | null;

  dpsCalcResults: DpsCalcResults;
  dpsGrapherResults: DpsGrapherResults;
}
