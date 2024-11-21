import { AttackType } from '../osrs/item.model';

export interface GearSet {
  label: string;
  itemIds: number[];
}

export type GearSetSetups = {
  [attackType in AttackType]: GearSet[];
};
