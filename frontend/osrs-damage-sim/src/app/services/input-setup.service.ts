import { ComponentRef, Injectable } from '@angular/core';
import { GearSetupTabsComponent } from '../core/gear-setup-tabs/gear-setup-tabs.component';
import {
  GearSetup,
  GearSetupSettings,
  GlobalSettings,
  InputGearSetup,
  InputSetup,
} from '../model/damage-sim/input-setup.model';
import { GearSetupTabComponent } from '../shared/gear-setup-tab/gear-setup-tab.component';
import { GearSetupComponent } from '../shared/gear-setup/gear-setup.component';
import { FILTER_PATHS } from './filter-fields.const';

@Injectable({
  providedIn: 'root',
})
export class InputSetupService {
  constructor() {}

  convertInputSetupToJson(inputSetup: InputSetup): string {
    return JSON.stringify(
      inputSetup,
      this.replacerWithPath((key: string, value: any, path: any) => {
        if (value instanceof Set) {
          return [...value];
        } else if (FILTER_PATHS.some((filter_path) => filter_path.test(path))) {
          return undefined;
        }

        return value;
      })
    );
  }

  getInputSetup(globalSettings: GlobalSettings, gearSetupTabsComponent: GearSetupTabsComponent): InputSetup {
    const inputSetup: InputSetup = {
      globalSettings: globalSettings,
      inputGearSetups: [],
    };

    gearSetupTabsComponent.gearSetupTabs.forEach((gearSetupTab: GearSetupTabComponent) => {
      const inputGearSetup: InputGearSetup = {
        gearSetupSettings: gearSetupTab.getGearSetupSettings(),
        gearSetups: [],
      };

      gearSetupTab.gearSetups.forEach((gearSetupRef: ComponentRef<GearSetupComponent>) => {
        inputGearSetup.gearSetups.push(gearSetupRef.instance.getGearSetup());
      });

      inputSetup.inputGearSetups.push(inputGearSetup);
    });

    return inputSetup;
  }

  getInputSetupAsJson(globalSettings: GlobalSettings, gearSetupTabsComponent: GearSetupTabsComponent): string {
    const inputSetup: InputSetup = this.getInputSetup(globalSettings, gearSetupTabsComponent);

    return this.convertInputSetupToJson(inputSetup);
  }

  parseInputSetup(jsonString: string): InputSetup {
    const data = JSON.parse(jsonString);

    const globalSettings: GlobalSettings = {
      iterations: data.globalSettings.iterations,
      npcId: data.globalSettings.npcId,
      raidLevel: data.globalSettings.raidLevel,
      pathLevel: data.globalSettings.pathLevel,
      teamSize: data.globalSettings.teamSize,
    };

    const inputGearSetups: InputGearSetup[] = data.inputGearSetups.map((inputGearSetup: InputGearSetup) => {
      const gearSetupSettings: GearSetupSettings = {
        statDrains: inputGearSetup.gearSetupSettings.statDrains,
        combatStats: inputGearSetup.gearSetupSettings.combatStats,
        boosts: new Set(Array.from(inputGearSetup.gearSetupSettings.boosts)),
      };

      const gearSetups: GearSetup[] = inputGearSetup.gearSetups.map((gearSetup: GearSetup) => ({
        setupName: gearSetup.setupName,
        gear: gearSetup.gear,
        blowpipeDarts: gearSetup.blowpipeDarts,
        attackStyle: gearSetup.attackStyle,
        spell: gearSetup.spell,
        isSpecial: gearSetup.isSpecial,
        prayers: new Set(Array.from(gearSetup.prayers)),
        isFill: gearSetup.isFill,
        conditions: gearSetup.conditions,
        statDrain: gearSetup.statDrain,
        isOnSlayerTask: gearSetup.isOnSlayerTask,
        isInWilderness: gearSetup.isInWilderness,
        currentHp: gearSetup.currentHp,
        miningLvl: gearSetup.miningLvl,
        isKandarinDiary: gearSetup.isKandarinDiary,
      }));

      return {
        gearSetupSettings,
        gearSetups,
      };
    });

    return {
      globalSettings,
      inputGearSetups,
    };
  }

  loadInputSetup(
    globalSettings: GlobalSettings,
    inputSetup: InputSetup,
    gearSetupTabsComponent: GearSetupTabsComponent
  ): void {
    inputSetup.inputGearSetups.forEach((inputGearSetup: InputGearSetup) => {
      gearSetupTabsComponent.openNewSetupTab();
      inputGearSetup.gearSetups.forEach((gearSetup: GearSetup) => {});
    });

    // gearSetupTabsComponent.gearSetupTabs.forEach((gearSetupTab: GearSetupTabComponent) => {
    //   const inputGearSetup: InputGearSetup = {
    //     gearSetupSettings: gearSetupTab.getGearSetupSettings(),
    //     gearSetups: [],
    //   };

    //   gearSetupTab.gearSetups.forEach((gearSetupRef: ComponentRef<GearSetupComponent>) => {
    //     inputGearSetup.gearSetups.push(gearSetupRef.instance.getGearSetup());
    //   });

    //   inputSetup.inputGearSetups.push(inputGearSetup);
    // });
  }

  private replacerWithPath(replacer: (this: any, key: string, value: any, path: string) => any) {
    let m = new Map<any, string>();

    return function (this: any, field: string, value: any) {
      let path = m.get(this) + (Array.isArray(this) ? `[${field}]` : '.' + field);
      if (value === Object(value)) m.set(value, path);
      return replacer.call(this, field, value, path.replace(/undefined\.\.?/, ''));
    };
  }
}
