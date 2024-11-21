import { Component, EventEmitter, Input, Output } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { allStatDrains, DEFAULT_STAT_DRAIN, StatDrain, statDrainLabels } from 'src/app/model/shared/stat-drain.model';

@Component({
  selector: 'app-stat-drain-selection',
  templateUrl: './stat-drain-selection.component.html',
})
export class StatDrainSelectionComponent {
  @Input()
  statDrains: StatDrain[];

  @Output()
  statDrainsChanged = new EventEmitter<StatDrain[]>();

  allStatDrains = [...allStatDrains];

  statDrainLabels = statDrainLabels;

  maxStatDrains = 5;

  addStatDrain(): void {
    this.statDrains.push(cloneDeep(DEFAULT_STAT_DRAIN));
    this.statDrainsChanged.emit(this.statDrains);
  }

  removeStatDrain(statDrain: StatDrain): void {
    const index = this.statDrains.indexOf(statDrain);
    if (index >= 0) {
      this.statDrains.splice(index, 1);
    }

    this.statDrainsChanged.emit(this.statDrains);
  }

  onStatDrainsChanged(): void {
    this.statDrainsChanged.emit(this.statDrains);
  }
}
