export const allSkills = ['attack', 'strength', 'ranged', 'magic', 'hitpoints', 'defence'] as const;
export type Skill = (typeof allSkills)[number];

export type CombatStats = {
  [name in Skill]: number;
};

export const DEFAULT_COMBAT_STATS: CombatStats = {
  attack: 99,
  strength: 99,
  ranged: 99,
  magic: 99,
  hitpoints: 99,
  defence: 99,
};
