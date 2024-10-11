import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BisCalcInputSetup } from 'src/app/model/bis-calc/bis-calc-input.model';
import { BisCalcResult, BisCalcResults } from 'src/app/model/bis-calc/bis-calc-result.model';
import { GearSlot } from 'src/app/model/osrs/gear-slot.enum';
import { Item } from 'src/app/model/osrs/item.model';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-bis-calc-results',
  templateUrl: './bis-calc-results.component.html',
})
export class BisCalcResultsComponent implements OnChanges {
  @Input()
  bisResults: BisCalcResults;

  @Input()
  bisCalcInputSetup: BisCalcInputSetup;

  allGearSlots: GearSlot[] = Object.values(GearSlot);
  gearSlotTable = [
    [null, GearSlot.Head, GearSlot.Ammo],
    [GearSlot.Cape, GearSlot.Neck, null],
    [GearSlot.Weapon, GearSlot.Body, GearSlot.Shield],
    [null, GearSlot.Legs, null],
    [GearSlot.Hands, GearSlot.Feet, GearSlot.Ring],
  ];

  constructor(private itemService: ItemService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bisResults'] && this.bisResults) {
      this.fillAllItems();
    }
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
      if (itemId == -1) continue;
      const item: Item = this.itemService.getItem(gearSlot, itemId);
      updatedGear[gearSlot] = item;
    }
    gearSetup.gear = updatedGear;
  }
}
