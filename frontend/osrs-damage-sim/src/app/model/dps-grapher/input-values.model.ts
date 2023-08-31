export const allInputValueTypes = [
  'Dragon warhammer',
  'Bandos godsword',
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
    type: 'Dragon warhammer',
    label: 'Hits',
  },
  {
    type: 'Bandos godsword',
    label: 'Damage',
  },
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
