import { StatDrainItem } from 'src/app/model/damage-sim/stat-drain.model';

export type StatDrainLabel = {
  [name in StatDrainItem]: string;
};

export const statDrainLabels: StatDrainLabel = {
  'Dragon warhammer': 'Hits',
  'Bandos godsword': 'Damage',
  'Arclight': 'Hits',
  'Bone dagger': 'Damage',
  'Accursed sceptre': 'Hits',
  'Barrelchest anchor': 'Damage'
};
