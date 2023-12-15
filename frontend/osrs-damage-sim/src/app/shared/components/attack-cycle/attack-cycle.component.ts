import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-attack-cycle',
  templateUrl: './attack-cycle.component.html',
  styleUrls: ['./attack-cycle.component.css'],
})
export class AttackCycleComponent {
  @Input()
  attackCycle: number;

  @Output()
  attackCycleChanged = new EventEmitter<number>();

  onAttackCycleChanged(): void {
    this.attackCycleChanged.emit(this.attackCycle);
  }
}
