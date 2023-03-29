import { Item } from '../osrs/item.model';

export interface InputGearSetupLabels {
  input_gear_setup_label: string;
  gear_setup_settings_label: string;
  all_weapon_labels: string[];
}

export interface SimStats {
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
  labels: InputGearSetupLabels;

  ttk_stats: SimStats;
  total_damage_stats: SimStats[];
  attack_count_stats: SimStats[];
  sim_dps_stats: SimStats[];

  theoretical_dps: number[];
  cumulative_chances: number[];
  max_hit: number[] | number[][];
  accuracy: number[];

  targetTimeChance?: number;
}

export const allSpecialProcs = ['None', 'RubyBolts', 'DiamondBolts', 'Gadderhammer'] as const;
export type SpecialProc = typeof allSpecialProcs[number];

export interface TickData {
  tick: number;
  weapon_name: string;
  weapon_id: number;
  weapon?: Item;
  is_special_attack: boolean;

  max_hits: number[];
  accuracy: number;

  damage: number;
  hitsplats: number[];
  roll_hits: boolean[];
  special_proc: SpecialProc;

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
  npc_hp: number;
  npc_defence: number;
  tick_data_details: TickDataDetails[];
}

export interface DamageSimResults {
  error?: string | null;

  detailed_runs: DetailedRun[];
  results: DamageSimResult[];
  global_settings_label: string;

  graphs: Graphs;
}
