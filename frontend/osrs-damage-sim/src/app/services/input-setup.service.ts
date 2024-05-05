import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GlobalSettingsComponent } from '../core/global-settings/global-settings.component';
import {
  GearSetup,
  GearSetupSettings,
  GlobalSettings,
  InputGearSetup,
  InputSetup,
} from '../model/damage-sim/input-setup.model';
import { GearSlot } from '../model/osrs/gear-slot.enum';
import { Item } from '../model/osrs/item.model';
import { Npc } from '../model/osrs/npc.model';
import { GearSetupTabComponent } from '../shared/components/gear-setup-tab/gear-setup-tab.component';
import { DamageSimService } from './damage-sim.service';
import { FILTER_PATHS } from './filter-fields.const';
import { ItemService } from './item.service';
import { LocalStorageService } from './local-storage.service';
import { UserSettings } from '../model/damage-sim/user-settings.model';
import { BisCalcSetup } from '../model/damage-sim/bis-calc-input.model';
import { GlobalSettingsService } from './global-settings.service';

@Injectable({
  providedIn: 'root',
})
export class InputSetupService {
  allNpcs: Npc[];

  loadInputSetup$: Subject<InputSetup> = new Subject();

  globalSettingsComponent$: BehaviorSubject<GlobalSettingsComponent> = new BehaviorSubject(null);
  gearSetupTabs$: BehaviorSubject<GearSetupTabComponent[]> = new BehaviorSubject(null);

  userSettingsWatch$: Observable<UserSettings>;

  constructor(
    private damageSimservice: DamageSimService,
    private itemService: ItemService,
    private localStorageService: LocalStorageService,
    private globalSettingsService: GlobalSettingsService
  ) {
    this.damageSimservice.allNpcs$.subscribe((allNpcs: Npc[]) => {
      this.allNpcs = allNpcs;
    });
  }

  getInputSetupAsJson(): string {
    const inputSetup: InputSetup = this.getInputSetup();
    return this.convertInputObjectToJson(inputSetup);
  }

  getBisCalcInputSetupAsJson(): string {
    const inputSetup: BisCalcSetup = {
      globalSettings: this.globalSettingsComponent$.getValue().globalSettings,
      gearSetupSettings: {
        statDrains: this.globalSettingsService.globalStatDrain$.getValue(),
        combatStats: this.globalSettingsService.globalCombatStats$.getValue(),
        boosts: this.globalSettingsService.globalBoosts$.getValue(),
        attackCycle: 0,
      },
    };
    return this.convertInputObjectToJson(inputSetup);
  }

  getInputSetup(): InputSetup {
    const globalSettings = this.globalSettingsComponent$.getValue().globalSettings;
    const gearSetupTabs = this.gearSetupTabs$.getValue();
    const inputSetup: InputSetup = {
      globalSettings: globalSettings,
      inputGearSetups: [],
      enableDebugTrack: this.localStorageService.userSettings$.getValue().enableDebugTracking,
    };

    gearSetupTabs.forEach((gearSetupTab: GearSetupTabComponent) => {
      const inputGearSetup: InputGearSetup = this.getGearInputSetup(gearSetupTab);
      inputSetup.inputGearSetups.push(inputGearSetup);
    });

    return inputSetup;
  }

  getGearInputSetup(gearSetupTab: GearSetupTabComponent): InputGearSetup {
    const inputGearSetup: InputGearSetup = {
      gearSetupSettings: gearSetupTab.getGearSetupSettings(),
      gearSetup: null,
    };

    //TODO should do refactor and give up the list in the tabs
    inputGearSetup.gearSetup = gearSetupTab.gearSetups[0].instance.getGearSetup();

    return inputGearSetup;
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

  private convertInputObjectToJson(inputObject: unknown): string {
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
