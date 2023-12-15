import { AttackType } from '../osrs/item.model';

export interface GearSetupPreset {
  isDefault: boolean;
  name: string;
  gearIds: number[];
  icon: string;
  attackType: AttackType;
}
