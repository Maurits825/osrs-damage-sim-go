export interface Prayer {
  name: string;
  isActive: boolean;
  replacesPrayers: Prayer[];
}

export const ThickSkin: Prayer = { name: 'thick_skin', isActive: false, replacesPrayers: [] };
export const BurstOfStrength: Prayer = { name: 'burst_of_strength', isActive: false, replacesPrayers: [] };
export const ClarityOfThought: Prayer = { name: 'clarity_of_thought', isActive: false, replacesPrayers: [] };
export const SharpEye: Prayer = { name: 'sharp_eye', isActive: false, replacesPrayers: [] };
export const MysticWill: Prayer = { name: 'mystic_will', isActive: false, replacesPrayers: [] };
export const RockSkin: Prayer = { name: 'rock_skin', isActive: false, replacesPrayers: [] };
export const SuperhumanStrength: Prayer = { name: 'superhuman_strength', isActive: false, replacesPrayers: [] };
export const ImprovedReflexes: Prayer = { name: 'improved_reflexes', isActive: false, replacesPrayers: [] };
export const RapidHeal: Prayer = { name: 'rapid_heal', isActive: false, replacesPrayers: [] };
export const RapidRestore: Prayer = { name: 'rapid_restore', isActive: false, replacesPrayers: [] };
export const ProtectItem: Prayer = { name: 'protect_item', isActive: false, replacesPrayers: [] };
export const HawkEye: Prayer = { name: 'hawk_eye', isActive: false, replacesPrayers: [] };
export const MysticLore: Prayer = { name: 'mystic_lore', isActive: false, replacesPrayers: [] };
export const SteelSkin: Prayer = { name: 'steel_skin', isActive: false, replacesPrayers: [] };
export const UltimateStrength: Prayer = { name: 'ultimate_strength', isActive: false, replacesPrayers: [] };
export const IncredibleReflexes: Prayer = { name: 'incredible_reflexes', isActive: false, replacesPrayers: [] };
export const ProtectFromMagic: Prayer = { name: 'protect_from_magic', isActive: false, replacesPrayers: [] };
export const ProtectFromMissiles: Prayer = { name: 'protect_from_missiles', isActive: false, replacesPrayers: [] };
export const ProtectFromMelee: Prayer = { name: 'protect_from_melee', isActive: false, replacesPrayers: [] };
export const EagleEye: Prayer = { name: 'eagle_eye', isActive: true, replacesPrayers: [] };
export const MysticMight: Prayer = { name: 'mystic_might', isActive: true, replacesPrayers: [] };
export const Retribution: Prayer = { name: 'retribution', isActive: false, replacesPrayers: [] };
export const Redemption: Prayer = { name: 'redemption', isActive: false, replacesPrayers: [] };
export const Smite: Prayer = { name: 'smite', isActive: false, replacesPrayers: [] };
export const Preserve: Prayer = { name: 'preserve', isActive: false, replacesPrayers: [] };
export const Chivalry: Prayer = { name: 'chivalry', isActive: true, replacesPrayers: [] };
export const Piety: Prayer = { name: 'piety', isActive: true, replacesPrayers: [] };
export const Rigour: Prayer = { name: 'rigour', isActive: true, replacesPrayers: [] };
export const Augury: Prayer = { name: 'augury', isActive: true, replacesPrayers: [] };

export const allPrayers: Prayer[] = [
  ThickSkin,
  BurstOfStrength,
  ClarityOfThought,
  SharpEye,
  MysticWill,
  RockSkin,
  SuperhumanStrength,
  ImprovedReflexes,
  RapidHeal,
  RapidRestore,
  ProtectItem,
  HawkEye,
  MysticLore,
  SteelSkin,
  UltimateStrength,
  IncredibleReflexes,
  ProtectFromMagic,
  ProtectFromMissiles,
  ProtectFromMelee,
  EagleEye,
  MysticMight,
  Retribution,
  Redemption,
  Smite,
  Preserve,
  Chivalry,
  Piety,
  Rigour,
  Augury,
];
