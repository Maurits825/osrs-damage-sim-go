import { ComponentRef, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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
import { GearSetupComponent } from '../shared/components/gear-setup/gear-setup.component';
import { DamageSimService } from './damage-sim.service';
import { FILTER_PATHS } from './filter-fields.const';
import { ItemService } from './item.service';
import { DpsGrapherInput } from '../model/dps-grapher/dps-grapher-input.model';
import { DpsGrapherSettings } from '../model/dps-grapher/dps-grapher-settings.model';

@Injectable({
  providedIn: 'root',
})
export class InputSetupService {
  allNpcs: Npc[];

  loadInputSetup$: Subject<InputSetup> = new Subject();

  globalSettingsComponent$: BehaviorSubject<GlobalSettingsComponent> = new BehaviorSubject(null);
  gearSetupTabs$: BehaviorSubject<GearSetupTabComponent[]> = new BehaviorSubject(null);

  dpsGrapherSettings$: BehaviorSubject<DpsGrapherSettings> = new BehaviorSubject({
    type: 'Dragon warhammer',
    min: 0,
    max: 10,
  });

  constructor(private damageSimservice: DamageSimService, private itemService: ItemService) {
    this.damageSimservice.allNpcs$.subscribe((allNpcs: Npc[]) => {
      this.allNpcs = allNpcs;
    });
  }

  getInputSetupAsJson(): string {
    const inputSetup: InputSetup = this.getInputSetup(
      this.globalSettingsComponent$.getValue().globalSettings,
      this.gearSetupTabs$.getValue()
    );
    return this.convertInputObjectToJson(inputSetup);
  }

  getDpsGrapherInputAsJson(): string {
    const inputSetup: InputSetup = this.getInputSetup(
      this.globalSettingsComponent$.getValue().globalSettings,
      this.gearSetupTabs$.getValue()
    );
    const dpsGrapherInput: DpsGrapherInput = {
      settings: this.dpsGrapherSettings$.getValue(),
      inputSetup: inputSetup,
    };
    return this.convertInputObjectToJson(dpsGrapherInput);
  }

  getInputSetup(globalSettings: GlobalSettings, gearSetupTabs: GearSetupTabComponent[]): InputSetup {
    const inputSetup: InputSetup = {
      globalSettings: globalSettings,
      inputGearSetups: [],
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
      mainGearSetup: null,
      fillGearSetups: [],
    };

    gearSetupTab.gearSetups.forEach((gearSetupRef: ComponentRef<GearSetupComponent>, index) => {
      if (index === 0) {
        inputGearSetup.mainGearSetup = gearSetupRef.instance.getGearSetup();
      } else {
        inputGearSetup.fillGearSetups.push(gearSetupRef.instance.getGearSetup());
      }
    });

    return inputGearSetup;
  }

  parseInputSetupFromEncodedString(encodedString: string): InputSetup {
    const inputSetupJson = JSON.parse(window.atob(encodedString));
    return this.parseInputSetupFromJson(inputSetupJson);
  }

  parseDpsGrapherInputFromEncodedString(encodedString: string): DpsGrapherInput {
    const dpsGrapherInputJson = JSON.parse(window.atob(encodedString));
    return {
      inputSetup: this.parseInputSetupFromJson(dpsGrapherInputJson['inputSetup']),
      settings: this.parseDpsGrapherSettingsFromJson(dpsGrapherInputJson['settings']),
    };
  }

  parseDpsGrapherSettingsFromJson(dpsGrapherSettings: DpsGrapherSettings): DpsGrapherSettings {
    return {
      type: dpsGrapherSettings.type,
      min: dpsGrapherSettings.min,
      max: dpsGrapherSettings.max,
    };
  }

  parseInputSetupFromJson(inputSetupJson: InputSetup): InputSetup {
    const npc = this.allNpcs.find((npc: Npc) => npc.id === inputSetupJson.globalSettings.npc?.id);

    const globalSettings: GlobalSettings = {
      iterations: inputSetupJson.globalSettings.iterations,
      npc: npc,
      raidLevel: inputSetupJson.globalSettings.raidLevel,
      pathLevel: inputSetupJson.globalSettings.pathLevel,
      isCoxChallengeMode: inputSetupJson.globalSettings.isCoxChallengeMode || false,
      teamSize: inputSetupJson.globalSettings.teamSize,
      isDetailedRun: inputSetupJson.globalSettings.isDetailedRun,
    };

    const inputGearSetups: InputGearSetup[] = inputSetupJson.inputGearSetups.map((inputGearSetup: InputGearSetup) => {
      const gearSetupSettings: GearSetupSettings = {
        statDrains: inputGearSetup.gearSetupSettings.statDrains,
        combatStats: inputGearSetup.gearSetupSettings.combatStats,
        boosts: new Set(Array.from(inputGearSetup.gearSetupSettings.boosts)),
      };

      const mainGearSetup: GearSetup = this.parseGearSetup(inputGearSetup.mainGearSetup);
      const fillGearSetups: GearSetup[] = inputGearSetup.fillGearSetups.map((gearSetup: GearSetup) =>
        this.parseGearSetup(gearSetup)
      );

      return {
        gearSetupSettings,
        mainGearSetup,
        fillGearSetups,
      };
    });

    return {
      globalSettings,
      inputGearSetups,
    };
  }

  private convertInputObjectToJson(inputObject: InputSetup | DpsGrapherInput): string {
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
      conditions: gearSetup.conditions,
      statDrain: gearSetup.statDrain,
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
