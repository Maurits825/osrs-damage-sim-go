import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GearSet } from 'src/app/model/shared/gear-set.model';
import { AttackType } from 'src/app/model/osrs/item.model';
import { gearSetSetups } from './gear-set.const';

@Component({
  selector: 'app-gear-set-select',
  templateUrl: './gear-set-select.component.html',
  styleUrls: ['./gear-set-select.component.css'],
})
export class GearSetSelectComponent {
  @Input()
  attackType: AttackType;

  @Output()
  selectSetup = new EventEmitter<GearSet>();

  AttackType: AttackType;
  gearSetSetups = gearSetSetups;

  onSelectSetup(setup: GearSet): void {
    this.selectSetup.emit(setup);
  }
}
