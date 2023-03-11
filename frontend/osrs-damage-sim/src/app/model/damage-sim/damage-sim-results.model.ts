export interface InputGearSetupLabels {
  input_gear_setup_label: string;
  gear_setup_settings_label: string;
  all_weapon_labels: string[];
}

export interface SimStats {
  [index: string]: any;

  average: string | number;
  maximum: string | number;
  minimum: string | number;
  most_frequent: string | number;

  chance_to_kill: string[] | number[];
}

export interface Graphs {
  time_to_kill_probability: string;
  time_to_kill_cumulative: string;
}

export interface DamageSimResult {
  labels: InputGearSetupLabels;

  ttk_stats: SimStats;
  total_damage_stats: SimStats[];
  attack_count_stats: SimStats[];
  sim_dps_stats: SimStats[];

  theoretical_dps: number[];
  cumulative_chances: number[];
  max_hit: number[];
  accuracy: number[];
}

export interface DamageSimResults {
  error?: string | null;

  results: DamageSimResult[];
  graphs: Graphs;
}
