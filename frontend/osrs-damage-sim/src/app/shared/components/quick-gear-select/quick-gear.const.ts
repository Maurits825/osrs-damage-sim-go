import { GearSlot } from 'src/app/model/osrs/gear-slot.enum';
import { AttackType } from 'src/app/model/osrs/item.model';

export type QuickGearSetup = {
  [gearSlot in GearSlot]: QuickGearIds;
};

export type QuickGearIds = {
  [attackType in AttackType]: number[];
};

//TODO replace
const avernicTreads = 2000004;
const conflictionGauntlets = 2000006;

export const quickGearSetups: QuickGearSetup = {
  [GearSlot.Head]: {
    melee: [25912, 10828, 24271, 12931],
    ranged: [25912],
    magic: [25912],
  },
  [GearSlot.Cape]: {
    melee: [6570, 21295],
    ranged: [22109, 10499],
    magic: [2414, 21795],
  },
  [GearSlot.Neck]: {
    melee: [1704, 6585, 19553, 29801],
    ranged: [1704, 6585, 19547],
    magic: [1704, 6585, 12002],
  },
  [GearSlot.Weapon]: {
    melee: [13652, 29577, 27690, 23987],
    ranged: [25865, 26374],
    magic: [12899, 11905],
  },
  [GearSlot.Body]: {
    melee: [10551],
    ranged: [],
    magic: [],
  },
  [GearSlot.Shield]: {
    melee: [12954, 22322],
    ranged: [22002, 21000],
    magic: [6889, 12825, 27251],
  },
  [GearSlot.Legs]: {
    melee: [],
    ranged: [],
    magic: [],
  },
  [GearSlot.Hands]: {
    melee: [7462, 22981],
    ranged: [7462, 26235],
    magic: [7462, 19544, conflictionGauntlets],
  },
  [GearSlot.Feet]: {
    melee: [11840, 13239, avernicTreads],
    ranged: [2577, 13237, avernicTreads],
    magic: [6920, 13235, avernicTreads],
  },
  [GearSlot.Ring]: {
    melee: [11773, 28316, 28307, 25975],
    ranged: [11771, 28310, 25975],
    magic: [11770, 28313, 25975],
  },
  [GearSlot.Ammo]: {
    melee: [],
    ranged: [21946, 21944, 21326, 11212],
    magic: [],
  },
};
