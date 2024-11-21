import { Injectable } from '@angular/core';
import { GearSetup } from '../model/shared/gear-setup.model';
import { InputGearSetup, InputSetup } from '../model/simple-dmg-sim/input-setup.model';
import { DEFAULT_GLOBAL_SETTINGS, GlobalSettings } from '../model/shared/global-settings.model';
import { FILTER_PATHS } from './filter-fields.const';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { JsonParseService } from './json-parse.service';

@Injectable({
  providedIn: 'root',
})
export class SimpleDmgSimInputService {
  //TODO default values, clean up mock data
  private inputSetup$: BehaviorSubject<InputSetup>;

  constructor(private jsonParseService: JsonParseService) {
    const gearSetups: InputGearSetup[] = [
      {
        gearSetupSettings: null,
        mainGearSimSetup: { gearPresetIndex: 0, conditions: [] },
        gearSimSetups: [],
      },
    ];

    this.inputSetup$ = new BehaviorSubject<InputSetup>({
      globalSettings: DEFAULT_GLOBAL_SETTINGS,
      gearPresets: [],
      inputGearSetups: gearSetups,
    });
  }

  public inputGearSetupsWatch(): Observable<InputGearSetup[]> {
    return this.inputSetup$.pipe(map((inputSetup: InputSetup) => inputSetup.inputGearSetups));
  }

  public gearSetupPresetsWatch(): Observable<GearSetup[]> {
    return this.inputSetup$.pipe(map((inputSetup: InputSetup) => inputSetup.gearPresets));
  }

  public globalSettingsWatch(): Observable<GlobalSettings> {
    return this.inputSetup$.pipe(map((inputSetup: InputSetup) => inputSetup.globalSettings));
  }

  public loadInputSetup(inputSetup: InputSetup): void {
    this.inputSetup$.next(inputSetup);
  }

  public getInputGearSetupFromJson(inputSetupJson: InputSetup): InputSetup {
    const presets = inputSetupJson.gearPresets.map((gearSetup: GearSetup) =>
      this.jsonParseService.parseGearSetup(gearSetup)
    );

    return {
      globalSettings: this.jsonParseService.parseGlobalSettings(inputSetupJson.globalSettings),
      gearPresets: presets,
      inputGearSetups: inputSetupJson.inputGearSetups.map((inputGearSetup) => ({
        gearSetupSettings: this.jsonParseService.parseGearSetupSettings(inputGearSetup.gearSetupSettings),
        mainGearSimSetup: inputGearSetup.mainGearSimSetup,
        gearSimSetups: inputGearSetup.gearSimSetups,
      })),
    };
  }

  //TODO find a better way???
  //i just dont want all the icon strings in the post requests, not needed
  public getInputSetupAsJson(): string {
    return JSON.stringify(
      this.inputSetup$.getValue(),
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
