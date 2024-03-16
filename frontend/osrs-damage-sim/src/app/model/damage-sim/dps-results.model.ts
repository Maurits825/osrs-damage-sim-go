import { DpsGrapherResults } from './dps-grapher-results.model';

export interface InputGearSetupLabels {
  input_gear_setup_label: string;
  gear_setup_settings_label: string;
  all_weapon_labels: string[];
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
