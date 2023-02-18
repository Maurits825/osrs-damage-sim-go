import { GearSlot } from '../../model/osrs/gear-slot.enum';
import { GearInputSetup } from '../../model/damage-sim/input-setup.model';

export const SPECIAL_BOLTS = [9242, 21944, 9243, 21946];
export const DRAGON_DARTS_ID = 11230;
export const BLOWPIPE_ID = 12924;
export const UNARMED_EQUIVALENT_ID = 3689;

export const DEFAULT_GEAR_SETUP: GearInputSetup = {
  setupName: null,
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
  combatStats: {
    attack: 99,
    strength: 99,
    ranged: 99,
    magic: 99,
    hitpoints: 99,
  },
  boosts: new Set(),
  isFill: false,
  conditions: [],
  statDrain: [],
  isOnSlayerTask: true,
  isInWilderness: true,
  currentHp: 1,
  miningLvl: 99,
  isKandarinDiary: true,
};
