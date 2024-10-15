import { Injectable } from '@angular/core';
import { GearSetup } from '../model/shared/gear-setup.model';
import { GEAR_SETUPS_MOCK } from './gear-presets.mock';
import { InputGearSetup } from '../model/simple-dmg-sim/input-setup.model';

@Injectable({
  providedIn: 'root',
})
export class SimpleDmgSimInputService {
  private inputGearSetups: InputGearSetup[] = [
    {
      gearSetupSettings: null,
      gearSimSetups: [],
    },
  ];
  private gearSetupPresets: GearSetup[] = GEAR_SETUPS_MOCK;

  public getInputGearSetups(): InputGearSetup[] {
    return this.inputGearSetups;
  }

  public getGearSetupPresets(): GearSetup[] {
    return this.gearSetupPresets;
  }
}
