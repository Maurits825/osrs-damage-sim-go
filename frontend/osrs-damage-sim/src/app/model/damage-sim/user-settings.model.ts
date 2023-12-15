export interface UserSettings {
  showAdvancedOptions: boolean;
  showTrailblazerReloadedRelics: boolean;
  showLoadFromRunelite: boolean;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  showAdvancedOptions: false,
  showTrailblazerReloadedRelics: false,
  showLoadFromRunelite: false,
};
