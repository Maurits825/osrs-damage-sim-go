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

export const TOA_NPC_IDS: MultiNpcPreset = {
  name: 'Tombs of Amascut',
  ids: ['11778', '11719', '11730', '11789', '11797', '11751', '11753', '11761'],
};

export const INFERNO_NPC_IDS: MultiNpcPreset = {
  name: 'Inferno',
  ids: ['7692', '7693', '7697', '7698', '7699', '7700', '7706'],
};

export const COLO_NPC_IDS: MultiNpcPreset = {
  name: 'Colosseum',
  ids: ['12811', '12810', '12817', '12818', '12819', '12812', '12821'],
};

export const NEX_NPC_IDS: MultiNpcPreset = {
  name: 'Nex',
  ids: ['11278', '11283', '11284', '11285', '11286'],
};

export const ALL_MULTI_NPC_PRESETS: MultiNpcPreset[] = [
  TOB_NORMAL_NPC_IDS,
  TOB_HARD_NPC_IDS,
  COX_MELEE_NPC_IDS,
  COX_MAGE_RANGE_NPC_IDS,
  TOA_NPC_IDS,
  INFERNO_NPC_IDS,
  COLO_NPC_IDS,
  NEX_NPC_IDS,
];
