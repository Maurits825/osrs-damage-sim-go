import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from 'src/app/model/osrs/item.model';

@Component({
  selector: 'app-quick-gear-select',
  templateUrl: './quick-gear-select.component.html',
})
export class QuickGearSelectComponent {
  @Input()
  items: Item[];

  @Output()
  equipGear = new EventEmitter<Item>();

  onGearSelect(item: Item): void {
    this.equipGear.emit(item);
  }
}
