import { GearSlot } from '../osrs/gear-slot.enum';
import { Item } from '../osrs/item.model';

export interface BisCalcResults {
  meleeGearSetups: BisCalcResult[];
  magicGearSetups: BisCalcResult[];

  error?: string;
}

export interface BisCalcResult {
  gear: Record<GearSlot, Item>;
  dps: number;
}
