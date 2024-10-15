import { Npc } from '../osrs/npc.model';

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
