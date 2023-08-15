import { GearSlot } from '../osrs/gear-slot.enum';
import { AttackType } from '../osrs/item.model';

export type QuickGear = {
  [attackType in AttackType]: number[];
};

export type QuickGearSlots = {
  [gearSlot in GearSlot]: QuickGear;
};
