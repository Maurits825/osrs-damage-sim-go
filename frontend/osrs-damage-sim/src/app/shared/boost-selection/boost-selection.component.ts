import { Component, EventEmitter, Input, Output } from '@angular/core';
import { allBoosts, Boost } from '../../model/osrs/boost.type';

@Component({
  selector: 'app-boost-selection',
  templateUrl: './boost-selection.component.html',
  styleUrls: ['./boost-selection.component.css'],
})
export class BoostSelectionComponent {
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
