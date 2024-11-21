export interface RagingEchoesSettings {
  combatMasteries: CombatMasteries;
}

export interface CombatMasteries {
  meleeTier: number;
  rangeTier: number;
  mageTier: number;
}

export const DEFAULT_RAGING_ECHOES_SETTINGS: RagingEchoesSettings = {
  combatMasteries: {
    meleeTier: 0,
    rangeTier: 0,
    mageTier: 0,
  },
};
