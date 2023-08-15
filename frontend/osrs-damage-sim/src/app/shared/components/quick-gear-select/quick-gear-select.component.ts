import { Component, Input } from '@angular/core';
import { GearSlot } from 'src/app/model/osrs/gear-slot.enum';
import { AttackType } from 'src/app/model/osrs/item.model';
import { quickGearSlots } from './quick-gear.const';

@Component({
  selector: 'app-quick-gear-select',
  templateUrl: './quick-gear-select.component.html',
  styleUrls: ['./quick-gear-select.component.css'],
})
export class QuickGearSelectComponent {
  @Input()
  gearSlot: GearSlot;

  @Input()
  attackType: AttackType;

  GearSlot = GearSlot;

  quickGearSlots = quickGearSlots;

  //TODO add fucntion when click to load the gear?
  //have an icon based on id -> item service?
}
