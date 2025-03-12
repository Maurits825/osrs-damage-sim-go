import { Npc } from '../osrs/npc.model';
import { GearSetupSettings } from '../shared/gear-setup-settings.model';
import { GearSetup } from '../shared/gear-setup.model';
import { GlobalSettings } from '../shared/global-settings.model';

export interface InputSetup {
  globalSettings: GlobalSettings;
  inputGearSetups: InputGearSetup[];
  enableDebugTrack: boolean;
  multiNpcs?: Npc[];
}

export interface InputGearSetup {
  gearSetupSettings: GearSetupSettings;
  gearSetup: GearSetup;
}
