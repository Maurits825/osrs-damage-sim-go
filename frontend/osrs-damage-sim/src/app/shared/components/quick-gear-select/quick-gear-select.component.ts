import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GearSlot } from 'src/app/model/osrs/gear-slot.enum';
import { allAttackTypes, AttackType, Item } from 'src/app/model/osrs/item.model';
import { QuickGear, QuickGearSlots } from 'src/app/model/shared/quick-gear.model';
import { StaticDataService } from 'src/app/services/static-data.service';
import { quickGearSetups } from './quick-gear.const';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-quick-gear-select',
  templateUrl: './quick-gear-select.component.html',
  styleUrls: ['./quick-gear-select.component.css'],
})
export class QuickGearSelectComponent implements OnInit {
  @Input()
  gearSlot: GearSlot;

  @Input()
  attackType: AttackType;

  @Output()
  equipGear = new EventEmitter<Item>();

  GearSlot = GearSlot;

  quickGearSlots: QuickGearSlots = {} as QuickGearSlots;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    for (const gearSlot in GearSlot) {
      const slot = GearSlot[gearSlot as keyof typeof GearSlot] as keyof QuickGearSlots;
      this.quickGearSlots[slot] = {} as QuickGear;
      for (const attackIdx in allAttackTypes) {
        const items: Item[] = [];
        const attackType = allAttackTypes[attackIdx];
        for (const itemId of (quickGearSetups as any)[slot][attackType]) {
          const item = this.itemService.getItem(slot, itemId);
          items.push(item);
        }
        (this.quickGearSlots as any)[slot][attackType] = items;
      }
    }
  }

  onGearSelect(item: Item): void {
    this.equipGear.emit(item);
  }
}
