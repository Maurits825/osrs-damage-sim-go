import { Injectable } from '@angular/core';
import { ItemService } from './item.service';
import { Npc } from '../model/osrs/npc.model';
import { GlobalSettings } from '../model/shared/global-settings.model';
import { StaticDataService } from './static-data.service';
import { GearSetupSettings } from '../model/shared/gear-setup-settings.model';
import { DRAGON_DARTS_ID, GearSetup } from '../model/shared/gear-setup.model';
import { GearSlot } from '../model/osrs/gear-slot.enum';
import { Item } from '../model/osrs/item.model';

@Injectable({
  providedIn: 'root',
})
export class JsonParseService {
  allNpcs: Npc[];

  constructor(private staticDataService: StaticDataService, private itemService: ItemService) {
    this.staticDataService.allNpcs$.subscribe((allNpcs: Npc[]) => {
      this.allNpcs = allNpcs;
    });
  }

  public parseGlobalSettings(globalSettings: GlobalSettings): GlobalSettings {
    const npc = this.allNpcs.find((npc: Npc) => npc.id === globalSettings.npc?.id);

    return {
      npc: npc,
      raidLevel: globalSettings.raidLevel,
      pathLevel: globalSettings.pathLevel,
      overlyDraining: globalSettings.overlyDraining || false,
      teamSize: globalSettings.teamSize,
      coxScaling: globalSettings.coxScaling,
    };
  }

  public parseGearSetupSettings(gearSetupSettings: GearSetupSettings): GearSetupSettings {
    return {
      statDrains: gearSetupSettings.statDrains,
      combatStats: gearSetupSettings.combatStats,
      boosts: new Set(Array.from(gearSetupSettings.boosts)),
      attackCycle: gearSetupSettings.attackCycle ?? 0,
      trailblazerRelics: gearSetupSettings.trailblazerRelics
        ? new Set(Array.from(gearSetupSettings.trailblazerRelics))
        : new Set(),
    };
  }

  public parseGearSetup(gearSetup: GearSetup): GearSetup {
    return {
      ...gearSetup,
      gear: this.getGearFromJson(gearSetup.gear),
      blowpipeDarts: this.itemService.getItem(GearSlot.Weapon, gearSetup.blowpipeDarts?.id ?? DRAGON_DARTS_ID),
      prayers: new Set(Array.from(gearSetup.prayers)),
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
}
