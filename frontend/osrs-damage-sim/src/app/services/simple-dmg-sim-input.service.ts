import { Injectable } from '@angular/core';
import { GearSetup } from '../model/shared/gear-setup.model';
import { GEAR_SETUPS_MOCK } from './gear-presets.mock';
import { InputGearSetup, InputSetup } from '../model/simple-dmg-sim/input-setup.model';
import { DEFAULT_GLOBAL_SETTIJNGS } from '../model/shared/global-settings.model';

@Injectable({
  providedIn: 'root',
})
export class SimpleDmgSimInputService {
  //TODO default values, clean up mock data
  private inputSetup: InputSetup;

  constructor() {
    const gearSetups: InputGearSetup[] = [
      {
        gearSetupSettings: null,
        mainGearSimSetup: { gearPresetIndex: 0, conditions: [] },
        gearSimSetups: [
          {
            gearPresetIndex: 0,
            conditions: [],
          },
          {
            gearPresetIndex: 1,
            conditions: [],
          },
        ],
      },
    ];

    this.inputSetup = {
      globalSettings: DEFAULT_GLOBAL_SETTIJNGS,
      gearPresets: GEAR_SETUPS_MOCK,
      inputGearSetups: gearSetups,
    };
  }

  public getInputGearSetups(): InputGearSetup[] {
    return this.inputSetup.inputGearSetups;
  }

  public getGearSetupPresets(): GearSetup[] {
    return this.inputSetup.gearPresets;
  }

  public getInputSetupAsJson(): string {
    const input = this.inputSetup;
    return JSON.stringify(input);
  }
}
