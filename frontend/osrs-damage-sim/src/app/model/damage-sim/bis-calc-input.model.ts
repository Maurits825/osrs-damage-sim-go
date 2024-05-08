import { AttackType } from '../osrs/item.model';
import { Prayer } from '../osrs/prayer.model';
import { GlobalSettings, GearSetupSettings } from './input-setup.model';

export interface BisCalcInputSetup {
  globalSettings: GlobalSettings;
  gearSetupSettings: GearSetupSettings;
  prayers: Record<AttackType | string, Set<Prayer>>;
  isOnSlayerTask: boolean;
  isSpecialAttack: boolean;
}
