import { QuickGearSetups } from 'src/app/model/damage-sim/quick-gear.model';

export const quickGearSetups: QuickGearSetups = {
  melee: [
    {
      label: 'Torva',
      itemIds: [26382, 26384, 26386],
    },
    {
      label: 'Bandos',
      itemIds: [11832, 11834],
    },
    {
      label: 'Inquisitor',
      itemIds: [24419, 24420, 24421],
    },
    {
      label: 'Void melee',
      itemIds: [11665, 13072, 13073],
    },
  ],
  ranged: [
    {
      label: 'Masori',
      itemIds: [27235, 27238, 27241],
    },
    {
      label: 'Void range',
      itemIds: [11664, 13072, 13073],
    },
  ],
  magic: [
    {
      label: 'Ancestral',
      itemIds: [21018, 21021, 21024],
    },
    {
      label: 'Void mage',
      itemIds: [11663, 13072, 13073],
    },
  ],
};
