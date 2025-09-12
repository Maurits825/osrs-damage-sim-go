import { Injectable } from '@angular/core';
import { Npc } from '../model/osrs/npc.model';
import { GlobalSettings } from '../model/shared/global-settings.model';
import { StaticDataService } from './static-data.service';
import { GearSetupSettings } from '../model/shared/gear-setup-settings.model';
import { DRAGON_DARTS_ID, GearSetup } from '../model/shared/gear-setup.model';
import { GearSlot } from '../model/osrs/gear-slot.enum';
import { Item } from '../model/osrs/item.model';
import { DEFAULT_RAGING_ECHOES_SETTINGS } from '../model/osrs/leagues/raging-echoes.model';

@Injectable({
  providedIn: 'root',
})
export class JsonParseService {
  allNpcs: Npc[];

  constructor(private staticDataService: StaticDataService) {
    this.staticDataService.allNpcs$.subscribe((allNpcs: Npc[]) => {
      this.allNpcs = allNpcs;
    });
  }

  public parseNpc(npc: Npc): Npc {
    return this.allNpcs.find((n: Npc) => n.id === npc.id);
  }

  public parseGlobalSettings(globalSettings: GlobalSettings): GlobalSettings {
    const npc = globalSettings.npc?.id ? this.parseNpc(globalSettings.npc) : null;

    return {
      npc: npc,
      raidLevel: globalSettings.raidLevel,
      pathLevel: globalSettings.pathLevel,
      overlyDraining: globalSettings.overlyDraining || false,
      teamSize: globalSettings.teamSize,
      accuracyBuff: globalSettings.accuracyBuff || false,
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
      ragingEchoesSettings: gearSetupSettings.ragingEchoesSettings ?? DEFAULT_RAGING_ECHOES_SETTINGS,
    };
  }

  public parseGearSetup(gearSetup: GearSetup): GearSetup {
    return {
      ...gearSetup,
      gear: this.getGearFromJson(gearSetup.gear),
      blowpipeDarts: this.staticDataService.getItem(GearSlot.Weapon, gearSetup.blowpipeDarts?.id ?? DRAGON_DARTS_ID),
      prayers: new Set(Array.from(gearSetup.prayers)),
    };
  }

  private getGearFromJson(gearJson: Record<string, Item>): Record<GearSlot, Item> {
    const gear: Record<GearSlot, Item> = {} as Record<GearSlot, Item>;
    const gearSlots = Object.values(GearSlot);

    gearSlots.forEach((slot) => {
      const itemId = gearJson[slot]?.id;

      if (itemId) {
        gear[slot] = this.staticDataService.getItem(slot, itemId);
      } else {
        gear[slot] = null;
      }
    });

    return gear;
  }
}
