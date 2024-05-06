import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BisCalcResult, BisCalcResults } from 'src/app/model/damage-sim/bis-calc-result.model';
import { GearSetupSettings } from 'src/app/model/damage-sim/input-setup.model';
import { GearSlot } from 'src/app/model/osrs/gear-slot.enum';
import { Item } from 'src/app/model/osrs/item.model';
import { Prayer } from 'src/app/model/osrs/prayer.model';
import { GlobalSettingsService } from 'src/app/services/global-settings.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-bis-calc-results',
  templateUrl: './bis-calc-results.component.html',
})
export class BisCalcResultsComponent implements OnChanges {
  @Input()
  bisResults: BisCalcResults;

  allGearSlots: GearSlot[] = Object.values(GearSlot);
  gearSlotTable = [
    [null, GearSlot.Head, GearSlot.Ammo],
    [GearSlot.Cape, GearSlot.Neck, null],
    [GearSlot.Weapon, GearSlot.Body, GearSlot.Shield],
    [null, GearSlot.Legs, null],
    [GearSlot.Hands, GearSlot.Feet, GearSlot.Ring],
  ];

  gearSetupSettings: GearSetupSettings;
  prayers: Record<string, Set<Prayer>>;

  constructor(private itemService: ItemService, private globalSettingsService: GlobalSettingsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bisResults'] && this.bisResults) {
      this.fillAllItems();
      this.gearSetupSettings = this.getGearSetupSettings();
      this.prayers = this.globalSettingsService.globalPrayers$.getValue();
    }
  }

  private getGearSetupSettings(): GearSetupSettings {
    return {
      statDrains: [...this.globalSettingsService.globalStatDrain$.getValue()],
      combatStats: this.globalSettingsService.globalCombatStats$.getValue(),
      boosts: new Set(this.globalSettingsService.globalBoosts$.getValue()),
      attackCycle: 0,
    };
  }

  private fillAllItems(): void {
    for (const gearSetup of this.bisResults.meleeGearSetups) {
      this.fillGearItems(gearSetup);
    }
    for (const gearSetup of this.bisResults.rangedGearSetups) {
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
