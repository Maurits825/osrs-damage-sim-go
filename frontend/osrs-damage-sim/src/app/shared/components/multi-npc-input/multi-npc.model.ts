export interface MultiNpcPreset {
  name: string;
  ids: string[];
}

export const TOB_NORMAL_NPC_IDS: MultiNpcPreset = {
  name: 'Theatre of Blood (Normal)',
  ids: ['8360', '8359', '8354', '8387', '8340', '8369', '8372', '8374'],
};

export const TOB_HARD_NPC_IDS: MultiNpcPreset = {
  name: 'Theatre of Blood (Hard)',
  ids: ['10822', '10813', '10807', '10867', '10772', '10847', '10850', '10852'],
};

export const COX_MELEE_NPC_IDS: MultiNpcPreset = {
  name: 'Chambers of Xeric melee',
  ids: ['7540', '7528', '7569', '7568', '7552'],
};

export const COX_MAGE_RANGE_NPC_IDS: MultiNpcPreset = {
  name: 'Chambers of Xeric mage & range',
  ids: ['7584', '7573', '7529', '7527', '7528', '7530', '7560', '7559', '7566', '7604', '7562', '7561'],
};

export const ALL_MULTI_NPC_PRESETS: MultiNpcPreset[] = [
  TOB_NORMAL_NPC_IDS,
  TOB_HARD_NPC_IDS,
  COX_MELEE_NPC_IDS,
  COX_MAGE_RANGE_NPC_IDS,
];
