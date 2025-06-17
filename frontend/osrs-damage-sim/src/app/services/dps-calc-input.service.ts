import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { InputGearSetup, InputSetup } from '../model/dps-calc/input-setup.model';
import { FILTER_PATHS } from './filter-fields.const';
import { LocalStorageService } from './local-storage.service';
import { UserSettings } from '../model/shared/user-settings.model';
import { GlobalSettings } from '../model/shared/global-settings.model';
import { JsonParseService } from './json-parse.service';
import { Npc } from '../model/osrs/npc.model';

export interface InputGearSetupProvider {
  getInputGearSetup(): InputGearSetup[];
}

export interface GlobalSettingsProvider {
  getGlobalSettings(): GlobalSettings;
}

export interface MultiNpcsProvider {
  getMultiNpcs(): Npc[];
}

@Injectable({
  providedIn: 'root',
})
export class DpsCalcInputService {
  loadInputSetup$: Subject<InputSetup> = new Subject();

  inputGearSetupProvider: InputGearSetupProvider;
  globalSettingProvider: GlobalSettingsProvider;
  multiNpcsProvider: MultiNpcsProvider;

  userSettingsWatch$: Observable<UserSettings>;

  constructor(
    private localStorageService: LocalStorageService,
    private jsonParseService: JsonParseService,
  ) {}

  getInputSetupAsJson(): string {
    const inputSetup: InputSetup = this.getInputSetup();
    return this.convertInputObjectToJson(inputSetup);
  }

  getInputSetup(): InputSetup {
    //TODO check if providers are not null??
    const inputSetup: InputSetup = {
      multiNpcs: this.multiNpcsProvider.getMultiNpcs(),
      globalSettings: this.globalSettingProvider.getGlobalSettings(),
      inputGearSetups: this.inputGearSetupProvider.getInputGearSetup(),
      enableDebugTrack: this.localStorageService.userSettings$.getValue().enableDebugTracking,
    };
    return inputSetup;
  }

  parseInputSetupFromEncodedString(encodedString: string): InputSetup {
    const inputSetupJson = JSON.parse(window.atob(encodedString));
    return this.parseInputSetupFromJson(inputSetupJson);
  }

  parseInputSetupFromJson(inputSetupJson: InputSetup): InputSetup {
    const inputGearSetups: InputGearSetup[] = inputSetupJson.inputGearSetups.map((inputGearSetup: InputGearSetup) => ({
      gearSetupSettings: this.jsonParseService.parseGearSetupSettings(inputGearSetup.gearSetupSettings),
      gearSetup: this.jsonParseService.parseGearSetup(inputGearSetup.gearSetup),
    }));

    return {
      globalSettings: this.jsonParseService.parseGlobalSettings(inputSetupJson.globalSettings),
      inputGearSetups,
      multiNpcs: (inputSetupJson.multiNpcs ?? []).map((npc: Npc) => this.jsonParseService.parseNpc(npc)),
      enableDebugTrack: false,
    };
  }

  //TODO refactor?
  public convertInputObjectToJson(inputObject: unknown): string {
    return JSON.stringify(
      inputObject,
      this.replacerWithPath((key: string, value: unknown, path: string) => {
        if (value instanceof Set) {
          return [...value];
        } else if (FILTER_PATHS.some((filter_path) => filter_path.test(path))) {
          return undefined;
        }

        return value;
      }),
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
