import { GearSlot } from '../osrs/gear-slot.enum';
import { AttackType, Item } from '../osrs/item.model';

export type QuickGear = {
  [attackType in AttackType]: Item[];
};

export type QuickGearSlots = {
  [gearSlot in GearSlot]: QuickGear;
};
