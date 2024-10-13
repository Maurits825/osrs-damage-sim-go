import { Component, Input } from '@angular/core';
import { SpecialGear } from 'src/app/model/shared/special-gear.model';
import { GearSlot } from 'src/app/model/osrs/gear-slot.enum';
import { Item } from 'src/app/model/osrs/item.model';
import { GearSetup } from 'src/app/model/shared/gear-setup.model';

@Component({
  selector: 'app-special-gear',
  templateUrl: './special-gear.component.html',
  styleUrls: ['./special-gear.component.css'],
})
export class SpecialGearComponent {
  @Input()
  gearSetup: GearSetup;

  @Input()
  specialGear: SpecialGear;

  @Input()
  slot: GearSlot;

  @Input()
  allDarts: Item[];

  GearSlot = GearSlot;
  Item: Item;

  dartChanged(dart: Item): void {
    this.gearSetup.blowpipeDarts = dart;
  }
}
