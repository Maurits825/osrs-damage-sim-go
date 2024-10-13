import { GearSlot } from '../osrs/gear-slot.enum';
import { Item } from '../osrs/item.model';
import { Prayer } from '../osrs/prayer.model';
import { Npc } from '../osrs/npc.model';
import { GearSetupSettings } from '../shared/gear-setup-settings.model';

export interface InputSetup {
  globalSettings: GlobalSettings;
  inputGearSetups: InputGearSetup[];
  enableDebugTrack: boolean;
}

export interface GlobalSettings {
  npc: Npc;

  raidLevel: number;
  pathLevel: number;
  overlyDraining: boolean;

  teamSize: number;
  coxScaling: CoxScaling;
}

export interface CoxScaling {
  partyMaxCombatLevel: number;
  partyAvgMiningLevel: number;
  partyMaxHpLevel: number;
  isChallengeMode: boolean;
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
