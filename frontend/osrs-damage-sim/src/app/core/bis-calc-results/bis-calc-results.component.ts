import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { delay, of } from 'rxjs';
import { BisCalcResult, BisCalcResults } from 'src/app/model/damage-sim/bis-calc-result.model';
import { GearSetupSettings } from 'src/app/model/damage-sim/input-setup.model';
import { GearSlot } from 'src/app/model/osrs/gear-slot.enum';
import { Item } from 'src/app/model/osrs/item.model';
import { Prayer } from 'src/app/model/osrs/prayer.model';
import { GlobalSettingsService } from 'src/app/services/global-settings.service';
import { InputSetupService } from 'src/app/services/input-setup.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-bis-calc-results',
  templateUrl: './bis-calc-results.component.html',
})
export class BisCalcResultsComponent implements OnChanges {
  @Input()
  bisResults: BisCalcResults = {
    title: ' | HP: 0',
    meleeGearSetups: [
      {
        gear: {
          '0': {
            id: 26382,
          },
          '1': {
            id: 21295,
          },
          '2': {
            id: 19553,
          },
          '3': {
            id: 26219,
          },
          '4': {
            id: 26384,
          },
          '5': {
            id: 22322,
          },
          '7': {
            id: 26386,
          },
          '9': {
            id: 22981,
          },
          '10': {
            id: 13239,
          },
          '12': {
            id: 28307,
          },
        },
        theoreticalDps: 8.332285,
        maxHit: [50, 25],
        accuracy: 0,
        attackRoll: 0,
      },
      {
        gear: {
          '0': {
            id: 26382,
          },
          '1': {
            id: 21295,
          },
          '2': {
            id: 19553,
          },
          '3': {
            id: 26219,
          },
          '4': {
            id: 26384,
          },
          '5': {
            id: 22322,
          },
          '7': {
            id: 26386,
          },
          '9': {
            id: 22981,
          },
          '10': {
            id: 13239,
          },
          '12': {
            id: 28307,
          },
        },
        theoreticalDps: 8.332285,
        maxHit: [50, 25],
        accuracy: 0,
        attackRoll: 0,
      },
    ],
    magicGearSetups: [
      {
        gear: {
          '0': {
            id: 26382,
          },
          '1': {
            id: 21295,
          },
          '2': {
            id: 19553,
          },
          '3': {
            id: 26219,
          },
          '4': {
            id: 26384,
          },
          '5': {
            id: 22322,
          },
          '7': {
            id: 26386,
          },
          '9': {
            id: 22981,
          },
          '10': {
            id: 13239,
          },
          '12': {
            id: 28307,
          },
        },
        theoreticalDps: 8.332285,
        maxHit: [50, 25],
        accuracy: 0,
        attackRoll: 0,
      },
    ],
  } as any;

  allGearSlots: GearSlot[] = Object.values(GearSlot);
  gearSlotTable = [
    [null, GearSlot.Head, GearSlot.Ammo],
    [GearSlot.Cape, GearSlot.Neck, null],
    [GearSlot.Weapon, GearSlot.Body, GearSlot.Shield],
    [null, GearSlot.Legs, null],
    [GearSlot.Hands, GearSlot.Feet, GearSlot.Ring],
  ];

  gearSetupSettings: GearSetupSettings;
  prayers: Prayer[] = ['piety']; //TODO input value for this?

  constructor(private itemService: ItemService, private globalSettingsService: GlobalSettingsService) {}

  ngAfterViewInit() {
    of(true)
      .pipe(delay(500))
      .subscribe(() => {
        this.fillAllItems();
        this.gearSetupSettings = this.getGearSetupSettings();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bisResults'] && this.bisResults) {
      this.fillAllItems();
      this.gearSetupSettings = this.getGearSetupSettings();
    }
  }

  //TODO from elsewhere if we have bis-calc route?
  private getGearSetupSettings(): GearSetupSettings {
    return {
      statDrains: this.globalSettingsService.globalStatDrain$.getValue(),
      combatStats: this.globalSettingsService.globalCombatStats$.getValue(),
      boosts: this.globalSettingsService.globalBoosts$.getValue(),
      attackCycle: 0,
    };
  }

  private fillAllItems(): void {
    for (const gearSetup of this.bisResults.meleeGearSetups) {
      this.fillGearItems(gearSetup);
    }
    for (const gearSetup of this.bisResults.magicGearSetups) {
      this.fillGearItems(gearSetup);
    }
  }

  private fillGearItems(gearSetup: BisCalcResult) {
    const updatedGear: Record<GearSlot, Item> = {} as Record<GearSlot, Item>;
    for (const slot of Object.keys(gearSetup.gear)) {
      const gearSlot: GearSlot = slot as GearSlot;
      const itemId: number = gearSetup.gear[gearSlot].id;
      const item: Item = this.itemService.getItem(gearSlot, itemId);
      updatedGear[gearSlot] = item;
    }
    gearSetup.gear = updatedGear;
  }
}
