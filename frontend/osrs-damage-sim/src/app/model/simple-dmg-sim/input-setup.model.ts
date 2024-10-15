import { GearSetupSettings } from '../shared/gear-setup-settings.model';
import { GearSetup } from '../shared/gear-setup.model';
import { GlobalSettings } from '../shared/global-settings.model';

export interface InputSetup {
  globalSettings: GlobalSettings;
  gearPresets: GearSetup[];
  inputGearSetups: InputGearSetup[];
}

export interface InputGearSetup {
  gearSetupSettings: GearSetupSettings;
  gearSimSetups: GearSimSetup[];
}

export interface GearSimSetup {
  gearPresetIndex: number;
}
