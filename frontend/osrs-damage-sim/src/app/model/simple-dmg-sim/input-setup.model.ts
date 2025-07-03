import { Condition } from '../shared/condition.model';
import { GearSetupSettings } from '../shared/gear-setup-settings.model';
import { GearSetup } from '../shared/gear-setup.model';
import { GlobalSettings } from '../shared/global-settings.model';

export interface InputSetup {
  globalSettings: GlobalSettings;
  simSettings: SimSettings;
  gearPresets: GearSetup[];
  inputGearSetups: InputGearSetup[];
}

export interface SimSettings {
  iterations: number;
  isDetailedRun: boolean;
}

export interface InputGearSetup {
  gearSetupSettings: GearSetupSettings;
  mainGearSimSetup: GearSimSetup;
  gearSimSetups: GearSimSetup[];
}

export interface GearSimSetup {
  gearPresetIndex: number;
  conditions: Condition[];
}

export const DEFAULT_SIM_SETTINGS: SimSettings = {
  iterations: 100_000,
  isDetailedRun: false,
};
