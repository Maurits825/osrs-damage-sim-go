export interface InputGearSetupLabels {
  input_gear_setup_label: string;
  gear_setup_settings_label: string;
  all_weapon_labels: string[];
}

export interface SimStats {
  [index: string]: string | number;

  average: string | number;
  maximum: string | number;
  minimum: string | number;
  most_frequent: string | number;

  chance_to_kill: string | number;
}

export interface Graphs {
  time_to_kill_probability: string;
  time_to_kill_cumulative: string;
}

export interface DamageSimResult {
  [index: string]: InputGearSetupLabels | SimStats | SimStats[] | number[] | number;

  labels: InputGearSetupLabels;

  ttk_stats: SimStats;
  total_damage_stats: SimStats[];
  attack_count_stats: SimStats[];
  sim_dps_stats: SimStats[];

  theoretical_dps: number[];
  cumulative_chances: number[];
  max_hit: number[];
  accuracy: number[];

  targetTimeChance?: number;
}

export interface TickData {
  tick: number;
  weapon_name: string;
  is_special_attack: boolean;
  max_hit: number;
  accuracy: number;
  hitsplats: number[] | number;

  npc_hitpoints: number;
  npc_defence: number;

  special_attack_amount: number;
}

export interface TickDataDetails {
  time_to_kill: string;
  tick_data: TickData[];
}

export interface DetailedRun {
  input_gear_setup_label: string;
  tick_data_details: TickDataDetails[];
}

export interface DamageSimResults {
  error?: string | null;

  detailed_runs: DetailedRun[];
  results: DamageSimResult[];
  global_settings_label: string;

  graphs: Graphs;
}
