export const allSkills = ['attack', 'strength', 'ranged', 'magic', 'hitpoints', 'defence'] as const;
export type Skill = (typeof allSkills)[number];

export type CombatStats = {
  [name in Skill]: number;
};
