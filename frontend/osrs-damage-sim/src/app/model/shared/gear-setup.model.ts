import { GearSlot } from '../osrs/gear-slot.enum';
import { Item } from '../osrs/item.model';
import { Prayer } from '../osrs/prayer.model';

export interface GearSetup {
  setupName: string;
  presetName: string;

  gear: Record<GearSlot, Item>;
  blowpipeDarts: Item;

  attackStyle: string;
  spell: string;

  isSpecial: boolean;
  prayers: Set<Prayer>;

  isOnSlayerTask: boolean;
  isInWilderness: boolean;

  currentHp: number;

  miningLvl: number;

  isKandarinDiary: boolean;
}

export const SPECIAL_BOLTS = [9242, 21944, 9243, 21946];
export const DRAGON_DARTS_ID = 11230;
export const BLOWPIPE_ID = 12926;
export const UNARMED_EQUIVALENT_ID = 3689;
export const AUTOCAST_STLYE = 'Spell (Magic/Autocast)';
export const WILDY_WEAPONS = [22547, 27652, 22552, 27785, 27662, 27676, 22542, 27657];

export const DHAROK_SET = [4716, 4718, 4720, 4722];
export const KARIL_SET = [4734, 4732, 4736, 4738];
export const AHRIM_SET = [4710, 4708, 4712, 4714];
export const VERAC_SET = [4755, 4753, 4757, 4759];

export interface QuickGearSet {
  label: string;
  itemIds: number[];
}

export const QUICK_GEAR_SETS: QuickGearSet[] = [
  { label: 'Dharok', itemIds: DHAROK_SET },
  { label: 'Karil', itemIds: KARIL_SET },
  { label: 'Ahrim', itemIds: AHRIM_SET },
  { label: 'Verac', itemIds: VERAC_SET },
];

export const DEFAULT_GEAR_SETUP: GearSetup = {
  setupName: null,
  presetName: null,
  gear: {
    [GearSlot.Head]: null,
    [GearSlot.Cape]: null,
    [GearSlot.Neck]: null,
    [GearSlot.Weapon]: null,
    [GearSlot.Body]: null,
    [GearSlot.Shield]: null,
    [GearSlot.Legs]: null,
    [GearSlot.Hands]: null,
    [GearSlot.Feet]: null,
    [GearSlot.Ring]: null,
    [GearSlot.Ammo]: null,
  },
  blowpipeDarts: null,
  attackStyle: null,
  spell: null,
  isSpecial: false,
  prayers: new Set(),
  isOnSlayerTask: true,
  isInWilderness: true,
  currentHp: 1,
  miningLvl: 99,
  isKandarinDiary: true,
};
