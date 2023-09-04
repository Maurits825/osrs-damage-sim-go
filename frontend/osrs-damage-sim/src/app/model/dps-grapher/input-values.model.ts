import { allStatDrains } from '../damage-sim/stat-drain.model';

export const allInputValueTypes = [
  ...(allStatDrains as unknown as string[]),
  'Attack',
  'Strength',
  'Ranged',
  'Magic',
  'Npc hitpoints',
] as const;
export type InputValueType = (typeof allInputValueTypes)[number];

export interface InputValue {
  type: InputValueType;
  label: string;
}

export const inputValues: InputValue[] = [
  {
    type: 'Attack',
    label: 'Level',
  },
  {
    type: 'Strength',
    label: 'Level',
  },
  {
    type: 'Ranged',
    label: 'Level',
  },
  {
    type: 'Magic',
    label: 'Level',
  },
  {
    type: 'Npc hitpoints',
    label: 'Hitpoints',
  },
];
