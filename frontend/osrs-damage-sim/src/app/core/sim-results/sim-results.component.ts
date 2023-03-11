import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SortConfigs, TimeSortField, SortOrder, timeSortFields, sortLabels } from 'src/app/model/damage-sim/sort.model';
import { DamageSimResult, DamageSimResults } from '../../model/damage-sim/damage-sim-results.model';

@Component({
  selector: 'app-sim-results',
  templateUrl: './sim-results.component.html',
  styleUrls: ['./sim-results.component.css'],
})
export class SimResultsComponent implements OnChanges {
  @Input()
  damageSimResults: DamageSimResults;

  targetTimeChance: number[];

  sortConfigs: SortConfigs = {
    average: { sortOrder: SortOrder.Ascending, isSorted: false },
    maximum: { sortOrder: SortOrder.Ascending, isSorted: false },
    minimum: { sortOrder: SortOrder.Ascending, isSorted: false },
    most_frequent: { sortOrder: SortOrder.Ascending, isSorted: false },
    chance_to_kill: { sortOrder: SortOrder.Ascending, isSorted: false },
  };

  SortOrder = SortOrder;
  timeSortFields = timeSortFields;
  sortLabels = sortLabels;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['damageSimResults']) this.sortDamageSimResults('average');
  }

  targetTimeChanged(targetTime: string): void {
    if (!targetTime) return;

    const targetSeconds = this.convertTimeStringToSeconds(targetTime);
    const targetTicks = Math.ceil(targetSeconds / 0.6);

    this.targetTimeChance = [];
    this.damageSimResults.results.forEach((damageSimResult: DamageSimResult) => {
      this.targetTimeChance.push(damageSimResult.cumulative_chances[targetTicks]);
    });
  }

  convertTimeStringToSeconds(timeString: string): number {
    const matches = timeString.match(/^([0-9]*):([0-9]*)\.([0-9]*)$/);
    const sec = +matches[1] * 60 + +matches[2] + +matches[3] / 10;
    return +matches[1] * 60 + +matches[2] + +matches[3] / 10;
  }

  sortDamageSimResults(sortField: TimeSortField): void {
    const sortOrder = this.sortConfigs[sortField].sortOrder;

    this.damageSimResults.results.sort(
      (result1: DamageSimResult, result2: DamageSimResult) =>
        sortOrder *
        (this.convertTimeStringToSeconds(result1.ttk_stats[sortField] as string) -
          this.convertTimeStringToSeconds(result2.ttk_stats[sortField] as string))
    );

    this.timeSortFields.forEach((field: TimeSortField) => (this.sortConfigs[field].isSorted = false));
    this.sortConfigs[sortField].isSorted = true;
    this.sortConfigs[sortField].sortOrder = this.sortConfigs[sortField].sortOrder * -1;
  }
}
