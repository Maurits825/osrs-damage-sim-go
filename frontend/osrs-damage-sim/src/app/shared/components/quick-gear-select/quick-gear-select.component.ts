import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GearSlot } from 'src/app/model/osrs/gear-slot.enum';
import { AttackType, Item } from 'src/app/model/osrs/item.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { QuickGearSlots } from 'src/app/model/damage-sim/quick-gear.model';

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

  @Output()
  equipGear = new EventEmitter<Item>();

  GearSlot = GearSlot;

  quickGearSlots: QuickGearSlots;

  constructor(private damageSimservice: DamageSimService) {
    this.damageSimservice.quickGearSlots$.subscribe((quickGearSlots: QuickGearSlots) => {
      this.quickGearSlots = quickGearSlots;
    });
  }

  onGearSelect(item: Item): void {
    this.equipGear.emit(item);
  }
}
