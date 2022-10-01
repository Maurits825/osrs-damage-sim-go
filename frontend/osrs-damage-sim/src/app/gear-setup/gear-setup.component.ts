import { Component, OnInit } from '@angular/core';
import { GearSlotItem, GearSlotItems } from '../model/gear_slot_items';
import { DamageSimService } from '../services/damage-sim.service';
import { RlGearService } from '../services/rl-gear.service';

@Component({
  selector: 'app-gear-setup',
  templateUrl: './gear-setup.component.html',
  styleUrls: ['./gear-setup.component.css']
})
export class GearSetupComponent implements OnInit {
  gearSlots: Array<any> = [0, 1, 2, 3, 4, 5, 7, 9, 10, 12, 13];

  gear: GearSlotItem = {};

  gearSlotItems: GearSlotItems = {};

  constructor(
    private damageSimservice: DamageSimService,
    private rlGearService: RlGearService,
    ) {}

  ngOnInit(): void {
    this.damageSimservice.getGearSlotItems().subscribe((gearSlotItems) => {
      this.gearSlotItems = gearSlotItems;

      this.gearSlots.forEach((slot: number) => {
        const empty_item = {name: "None", id: 0}
        this.gearSlotItems[slot].push(empty_item)
        this.gear[slot] = empty_item;
      });
    });
  }

  clearAllGear(): void {
    this.gearSlots.forEach((slot: number) => {
      this.gear[slot].name = "None";
      this.gear[slot].id = 0;
    });
  }

  loadRlGear(): void {
    this.rlGearService.getGear()
      .subscribe((gearSlotItem: GearSlotItem) => {
        this.gearSlots.forEach((slot: number) => {
          if (gearSlotItem[slot]?.name) {
            this.gear[slot].name = gearSlotItem[slot].name;
            this.gear[slot].id = gearSlotItem[slot].id;
          }
          else {
            this.gear[slot].name = "None";
            this.gear[slot].id = 0;
          }
        });
    });

    console.log(this.gear);
  }

  clearGearSlot(slot: number): void {
    this.gear[slot].name = "None";
    this.gear[slot].id = 0;
  }
}
