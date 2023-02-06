export const allBoosts = [
  'smelling_salts',
  'overload_plus',
  'super_combat_pot',
  'ranged_pot',
  'liquid_adrenaline',
] as const;

export type Boost = typeof allBoosts[number];
