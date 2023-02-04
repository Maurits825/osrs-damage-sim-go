import { Component, EventEmitter, Input, Output } from '@angular/core';
import { allBoosts, Boost } from '../model/boost.type';

@Component({
  selector: 'app-boost-item',
  templateUrl: './boost-item.component.html',
  styleUrls: ['./boost-item.component.css'],
})
export class BoostItemComponent {
  @Input()
  selectedBoosts: Set<Boost>;

  @Output()
  boostAdded = new EventEmitter<Boost>();
  @Output()
  boostRemoved = new EventEmitter<Boost>();

  allBoosts = allBoosts;

  constructor() {}

  addBoost(boost: Boost): void {
    this.boostAdded.emit(boost);
  }

  removeBoost(boost: Boost): void {
    this.boostRemoved.emit(boost);
  }
}
