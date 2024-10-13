import { Npc } from '../osrs/npc.model';
import { GearSetupSettings } from '../shared/gear-setup-settings.model';
import { GearSetup } from '../shared/gear-setup.model';

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
