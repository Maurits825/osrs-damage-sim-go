import { DpsGrapherResults } from './dps-grapher-results.model';

export interface InputGearSetupLabels {
  input_gear_setup_label: string;
  gear_setup_settings_label: string;
  all_weapon_labels: string[];
}

export interface DpsCalcResult {
  error?: string | null;

  labels: InputGearSetupLabels;
  theoretical_dps: number;
  max_hit: number[];
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
