import { Injectable } from '@angular/core';
import { GearSetup } from '../model/shared/gear-setup.model';
import { GEAR_SETUPS_MOCK } from './gear-presets.mock';
import { InputGearSetup, InputSetup } from '../model/simple-dmg-sim/input-setup.model';
import { DEFAULT_GLOBAL_SETTINGS, GlobalSettings } from '../model/shared/global-settings.model';
import { omit, omitBy } from 'lodash-es';
import { FILTER_PATHS } from './filter-fields.const';

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
      globalSettings: DEFAULT_GLOBAL_SETTINGS,
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

  public getGlobalSettings(): GlobalSettings {
    return this.inputSetup.globalSettings;
  }

  //TODO find a better way???
  //i just dont want all the icon strings in the post requests, not needed
  public getInputSetupAsJson(): string {
    return JSON.stringify(
      this.inputSetup,
      this.replacerWithPath((key: string, value: unknown, path: string) => {
        if (value instanceof Set) {
          return [...value];
        } else if (FILTER_PATHS.some((filter_path) => filter_path.test(path))) {
          return undefined;
        }

        return value;
      })
    );
  }

  private replacerWithPath(replacer: (this: unknown, key: string, value: unknown, path: string) => unknown) {
    const m = new Map<unknown, string>();

    return function (this: unknown, field: string, value: unknown) {
      const path = m.get(this) + (Array.isArray(this) ? `[${field}]` : '.' + field);
      if (value === Object(value)) m.set(value, path);
      return replacer.call(this, field, value, path.replace(/undefined\.\.?/, ''));
    };
  }
}
