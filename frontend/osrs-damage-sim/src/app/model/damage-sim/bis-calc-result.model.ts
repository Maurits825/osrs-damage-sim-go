import { GearSlot } from '../osrs/gear-slot.enum';
import { Item } from '../osrs/item.model';

export interface BisCalcResults {
  title: string;
  meleeGearSetups: BisCalcResult[];
  rangedGearSetups: BisCalcResult[];
  magicGearSetups: BisCalcResult[];

  error?: string;
}

export interface BisCalcResult {
  gear: Record<GearSlot, Item>;
  spell: string;
  attackStyle: string;
  theoreticalDps: number;
  maxHit: number[];
  accuracy: number;
  attackRoll: number;
}
