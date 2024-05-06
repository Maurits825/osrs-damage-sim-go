import { AttackType } from '../osrs/item.model';
import { Prayer } from '../osrs/prayer.model';
import { GlobalSettings, GearSetupSettings } from './input-setup.model';

export interface BisCalcSetup {
  globalSettings: GlobalSettings;
  gearSetupSettings: GearSetupSettings;
  prayers: Record<AttackType, Set<Prayer>>;
  isOnSlayerTask: boolean;
}
