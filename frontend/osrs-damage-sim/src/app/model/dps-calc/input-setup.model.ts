import { GearSetupSettings } from '../shared/gear-setup-settings.model';
import { GearSetup } from '../shared/gear-setup.model';
import { GlobalSettings } from '../shared/global-settings.model';

export interface InputSetup {
  globalSettings: GlobalSettings;
  inputGearSetups: InputGearSetup[];
  enableDebugTrack: boolean;
}

export interface InputGearSetup {
  gearSetupSettings: GearSetupSettings;
  gearSetup: GearSetup;
}
