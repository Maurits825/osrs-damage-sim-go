import { Boost } from '../osrs/boost.model';
import { RagingEchoesSettings } from '../osrs/leagues/raging-echoes.model';
import { TrailblazerRelic } from '../osrs/leagues/trailblazer-relics.model';
import { CombatStats } from '../osrs/skill.type';
import { StatDrain } from './stat-drain.model';

export interface GearSetupSettings {
  statDrains: StatDrain[];
  combatStats: CombatStats;
  boosts: Set<Boost>;

  attackCycle: number;

  trailblazerRelics?: Set<TrailblazerRelic>;
  ragingEchoesSettings?: RagingEchoesSettings;
}

export const DEFAULT_GEAR_SETUP_SETTINGS: GearSetupSettings = {
  statDrains: null,
  boosts: null,
  combatStats: null,
  attackCycle: 0,
  trailblazerRelics: null,
  ragingEchoesSettings: null,
};
