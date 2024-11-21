import { BisCalcInputSetup } from 'src/app/model/bis-calc/bis-calc-input.model';

export const DEFAULT_BIS_INPUT_SETUP: BisCalcInputSetup = {
  globalSettings: {
    npc: null,
    teamSize: 1,
    raidLevel: 0,
    pathLevel: 0,
    overlyDraining: false,
    coxScaling: {
      partyMaxCombatLevel: 126,
      partyAvgMiningLevel: 99,
      partyMaxHpLevel: 99,
      isChallengeMode: false,
    },
  },
  gearSetupSettings: {
    statDrains: [],
    combatStats: {
      attack: 99,
      strength: 99,
      ranged: 99,
      magic: 99,
      hitpoints: 99,
      defence: 99,
    },
    boosts: new Set(),
    attackCycle: 0,
    trailblazerRelics: null,
  },
  prayers: {
    magic: new Set(['augury']),
    melee: new Set(['piety']),
    ranged: new Set(['rigour']),
  },
  isOnSlayerTask: false,
  isSpecialAttack: false,
};
