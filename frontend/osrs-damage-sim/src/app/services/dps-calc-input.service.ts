import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GlobalSettings, InputGearSetup, InputSetup } from '../model/dps-calc/input-setup.model';
import { GearSlot } from '../model/osrs/gear-slot.enum';
import { Item } from '../model/osrs/item.model';
import { Npc } from '../model/osrs/npc.model';
import { FILTER_PATHS } from './filter-fields.const';
import { ItemService } from './item.service';
import { LocalStorageService } from './local-storage.service';
import { UserSettings } from '../model/shared/user-settings.model';
import { StaticDataService } from './static-data.service';
import { GearSetupSettings } from '../model/shared/gear-setup-settings.model';
import { GearSetup } from '../model/shared/gear-setup.model';

export interface InputGearSetupProvider {
  getInputGearSetup(): InputGearSetup[];
}

export interface GlobalSettingsProvider {
  getGlobalSettings(): GlobalSettings;
}

@Injectable({
  providedIn: 'root',
})
export class DpsCalcInputService {
  allNpcs: Npc[];

  loadInputSetup$: Subject<InputSetup> = new Subject();

  inputGearSetupProvider: InputGearSetupProvider;
  globalSettingProvider: GlobalSettingsProvider;

  userSettingsWatch$: Observable<UserSettings>;

  constructor(
    private staticDataService: StaticDataService,
    private itemService: ItemService,
    private localStorageService: LocalStorageService
  ) {
    this.staticDataService.allNpcs$.subscribe((allNpcs: Npc[]) => {
      this.allNpcs = allNpcs;
    });
  }

  getInputSetupAsJson(): string {
    const inputSetup: InputSetup = this.getInputSetup();
    return this.convertInputObjectToJson(inputSetup);
  }

  getInputSetup(): InputSetup {
    //TODO check if providers are not null??
    const inputSetup: InputSetup = {
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
    // TODO is there a better way?
    const npc = this.allNpcs.find((npc: Npc) => npc.id === inputSetupJson.globalSettings.npc?.id);

    const globalSettings: GlobalSettings = {
      npc: npc,
      raidLevel: inputSetupJson.globalSettings.raidLevel,
      pathLevel: inputSetupJson.globalSettings.pathLevel,
      overlyDraining: inputSetupJson.globalSettings.overlyDraining || false,
      teamSize: inputSetupJson.globalSettings.teamSize,
      coxScaling: inputSetupJson.globalSettings.coxScaling,
    };

    const inputGearSetups: InputGearSetup[] = inputSetupJson.inputGearSetups.map((inputGearSetup: InputGearSetup) => {
      const gearSetupSettings: GearSetupSettings = {
        statDrains: inputGearSetup.gearSetupSettings.statDrains,
        combatStats: inputGearSetup.gearSetupSettings.combatStats,
        boosts: new Set(Array.from(inputGearSetup.gearSetupSettings.boosts)),
        attackCycle: inputGearSetup.gearSetupSettings.attackCycle ?? 0,
        trailblazerRelics: inputGearSetup.gearSetupSettings.trailblazerRelics
          ? new Set(Array.from(inputGearSetup.gearSetupSettings.trailblazerRelics))
          : new Set(),
      };

      const gearSetup: GearSetup = this.parseGearSetup(inputGearSetup.gearSetup);

      return {
        gearSetupSettings,
        gearSetup,
      };
    });

    return {
      globalSettings,
      inputGearSetups,
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
      })
    );
  }

  private parseGearSetup(gearSetup: GearSetup): GearSetup {
    return {
      setupName: gearSetup.setupName,
      presetName: gearSetup.presetName,

      gear: this.getGearFromJson(gearSetup.gear),
      blowpipeDarts: this.itemService.getItem(GearSlot.Weapon, gearSetup.blowpipeDarts.id),
      attackStyle: gearSetup.attackStyle,
      spell: gearSetup.spell,
      isSpecial: gearSetup.isSpecial,
      prayers: new Set(Array.from(gearSetup.prayers)),
      isOnSlayerTask: gearSetup.isOnSlayerTask,
      isInWilderness: gearSetup.isInWilderness,
      currentHp: gearSetup.currentHp,
      miningLvl: gearSetup.miningLvl,
      isKandarinDiary: gearSetup.isKandarinDiary,
    };
  }

  private getGearFromJson(gearJson: Record<string, Item>): Record<GearSlot, Item> {
    const gear: Record<GearSlot, Item> = {} as Record<GearSlot, Item>;
    const gearSlots = Object.values(GearSlot);

    gearSlots.forEach((slot) => {
      const itemId = gearJson[slot]?.id;

      if (itemId) {
        gear[slot] = this.itemService.getItem(slot, itemId);
      } else {
        gear[slot] = null;
      }
    });

    return gear;
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
