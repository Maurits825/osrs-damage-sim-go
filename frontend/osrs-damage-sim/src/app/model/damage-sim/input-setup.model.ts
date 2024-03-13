import { Boost } from '../osrs/boost.model';
import { Condition } from './condition.model';
import { GearSlot } from '../osrs/gear-slot.enum';
import { Item } from '../osrs/item.model';
import { CombatStats } from '../osrs/skill.type';
import { Prayer } from '../osrs/prayer.model';
import { StatDrain } from './stat-drain.model';
import { Npc } from '../osrs/npc.model';
import { TrailblazerRelic } from '../osrs/leagues/trailblazer-relics.model';

export interface InputSetup {
  globalSettings: GlobalSettings;
  inputGearSetups: InputGearSetup[];
}

export interface GlobalSettings {
  npc: Npc;

  raidLevel: number;
  pathLevel: number;
  overlyDraining: boolean;

  isCoxChallengeMode: boolean;

  teamSize: number;
}

export interface ContinuousSimSettings {
  enabled: boolean;
  killCount: number;
  deathCharge: boolean;
  respawnTicks: number;
}

export interface InputGearSetup {
  gearSetupSettings: GearSetupSettings;
  gearSetup: GearSetup;
}

export interface GearSetupSettings {
  statDrains: StatDrain[];
  combatStats: CombatStats;
  boosts: Set<Boost>;

  attackCycle: number;

  trailblazerRelics?: Set<TrailblazerRelic>;
}

export interface GearSetup {
  setupName: string;
  presetName: string;

  gear: Record<GearSlot, Item>;
  blowpipeDarts: Item;

  attackStyle: string;
  spell: string;

  isSpecial: boolean;
  prayers: Set<Prayer>;

  isOnSlayerTask: boolean;
  isInWilderness: boolean;

  currentHp: number;

  miningLvl: number;

  isKandarinDiary: boolean;
}
