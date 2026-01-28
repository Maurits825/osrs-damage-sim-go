import { Npc } from '../osrs/npc.model';

export interface GlobalSettings {
  npc: Npc;

  raidLevel: number;
  pathLevel: number;
  overlyDraining: boolean;

  teamSize: number;
  accuracyBuff: boolean;
  minDefence: boolean;
  coxScaling: CoxScaling;
}

export interface CoxScaling {
  partyMaxCombatLevel: number;
  partyAvgMiningLevel: number;
  partyMaxHpLevel: number;
  isChallengeMode: boolean;
}

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  npc: null,
  teamSize: 1,
  accuracyBuff: false,
  minDefence: false,
  raidLevel: 0,
  pathLevel: 0,
  overlyDraining: false,
  coxScaling: {
    partyMaxCombatLevel: 126,
    partyAvgMiningLevel: 99,
    partyMaxHpLevel: 99,
    isChallengeMode: false,
  },
};
