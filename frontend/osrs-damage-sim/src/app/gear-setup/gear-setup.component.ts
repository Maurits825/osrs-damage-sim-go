import { Component, OnInit } from '@angular/core';
import { GearSlotItems } from '../model/gear_slot_items';
import { Item } from '../model/item';
import { DamageSimService } from '../services/damage-sim.service';

@Component({
  selector: 'app-gear-setup',
  templateUrl: './gear-setup.component.html',
  styleUrls: ['./gear-setup.component.css']
})
export class GearSetupComponent implements OnInit {
  gearSlots: Array<any> = [0, 1, 2, 3, 4, 5, 7, 9, 10, 12, 13];

  gear = new Map<number, Item>();

  gearSlotItems: GearSlotItems = {};
  gearSlotItemsFiltered: GearSlotItems = {};

  fruits = ["apple", "orange", "banana", "grapes"];

  constructor(private damageSimservice: DamageSimService) {
    this.gearSlots.forEach(slot => {
      this.gear.set(slot, {name: "", id: null});
    });
  }

  ngOnInit(): void {
    this.damageSimservice.getGearSlotItems().subscribe((gearSlotItems) => {
      this.gearSlotItems = gearSlotItems;
      this.gearSlotItemsFiltered = gearSlotItems;
    });
  }

  filterItems(filterText: string, slot: number): void {
    this.gearSlotItemsFiltered[slot] = this.gearSlotItems[slot].filter((item: Item) => item.name.toLowerCase().includes(filterText.toLowerCase()));
  }
}
