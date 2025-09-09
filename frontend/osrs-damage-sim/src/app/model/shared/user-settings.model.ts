export interface UserSettings {
  showAdvancedOptions: boolean;
  showTrailblazerReloadedRelics: boolean;
  showRagingEchoLeagues: boolean;
  showLoadFromRunelite: boolean;
  enableDebugTracking: boolean;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  showAdvancedOptions: false,
  showTrailblazerReloadedRelics: false,
  showRagingEchoLeagues: true,
  showLoadFromRunelite: false,
  enableDebugTracking: false,
};
