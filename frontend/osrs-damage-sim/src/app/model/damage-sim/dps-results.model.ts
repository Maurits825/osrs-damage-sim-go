import { DpsGrapherResults } from './dps-grapher-results.model';

export interface InputGearSetupLabels {
  gearSetupSettingsLabel: string;
  setupName: string;
}

export interface DpsCalcResult {
  error?: string | null;

  labels: InputGearSetupLabels;
  theoreticalDps: number;
  maxHit: number[];
  accuracy: number;
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
