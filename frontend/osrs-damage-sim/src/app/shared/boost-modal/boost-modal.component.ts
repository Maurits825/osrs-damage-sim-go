import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { allBoosts, Boost } from 'src/app/model/osrs/boost.type';

@Component({
  selector: 'app-boost-modal',
  templateUrl: './boost-modal.component.html',
  styleUrls: ['./boost-modal.component.css'],
})
export class BoostModalComponent {
  @Input()
  selectedBoosts: Set<Boost>;

  @Output()
  boostToggle = new EventEmitter<Boost>();

  rows = Array(6)
    .fill(0)
    .map((_, i) => i);
  cols = Array(5)
    .fill(0)
    .map((_, i) => i);

  allBoosts = allBoosts;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  toggleBoost(boost: Boost): void {
    this.boostToggle.emit(boost);
  }
}
