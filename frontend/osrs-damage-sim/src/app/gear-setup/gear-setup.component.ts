import { Component, OnInit } from '@angular/core';
import { GearSlotItem, GearSlotItems } from '../model/gear_slot_items';
import { Item } from '../model/item';
import { DamageSimService } from '../services/damage-sim.service';

@Component({
  selector: 'app-gear-setup',
  templateUrl: './gear-setup.component.html',
  styleUrls: ['./gear-setup.component.css']
})
export class GearSetupComponent implements OnInit {
  gearSlots: Array<any> = [0, 1, 2, 3, 4, 5, 7, 9, 10, 12, 13];

  gear: GearSlotItem = {};

  gearSlotItems: GearSlotItems = {};

  constructor(private damageSimservice: DamageSimService) {
    this.clearAllGear();
    console.log(this.gear);
  }

  ngOnInit(): void {
    this.damageSimservice.getGearSlotItems().subscribe((gearSlotItems) => {
      this.gearSlotItems = gearSlotItems;
    });
  }

  clearAllGear(): void {
    this.gearSlots.forEach((slot: number) => {
      this.gear[slot] = {name: "", id: 0};
    });
  }
}
