import { AttackType } from '../osrs/item.model';
import { Prayer } from '../osrs/prayer.model';
import { GearSetupSettings } from '../shared/gear-setup-settings.model';
import { GlobalSettings } from '../shared/global-settings.model';

export interface BisCalcInputSetup {
  globalSettings: GlobalSettings;
  gearSetupSettings: GearSetupSettings;
  prayers: Record<AttackType | string, Set<Prayer>>;
  isOnSlayerTask: boolean;
  isSpecialAttack: boolean;
}
