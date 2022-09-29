import { Component, OnInit } from '@angular/core';
import { Item } from '../model/item';

@Component({
  selector: 'app-gear-setup',
  templateUrl: './gear-setup.component.html',
  styleUrls: ['./gear-setup.component.css']
})
export class GearSetupComponent implements OnInit {
  gearSlots: Array<any> = [0, 1, 2, 3, 4, 5, 7, 9, 10, 12, 13];

  gear = new Map<number, Item>();

  constructor() {
    this.gearSlots.forEach(slot => {
      this.gear.set(slot, {id: -1});
    });

    this.gearSlots.forEach(slot => {
      console.log(this.gear.get(slot))
    });
  }

  ngOnInit(): void {
  }

  clearSlot(slot: number): void {
    let item = this.gear.get(slot)

    if (item) {
      item.id = -1;
    }
  }
}
