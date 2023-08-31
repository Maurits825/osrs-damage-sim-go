import { InputSetup } from '../damage-sim/input-setup.model';
import { DpsGrapherSettings } from './dps-grapher-settings.model';

export interface DpsGrapherInput {
  settings: DpsGrapherSettings;
  inputSetup: InputSetup;
}
