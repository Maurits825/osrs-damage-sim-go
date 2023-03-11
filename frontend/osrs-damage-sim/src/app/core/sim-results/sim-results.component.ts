import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  SortConfigs,
  TimeSortField,
  SortOrder,
  timeSortFields,
  sortLabels,
  dpsSortFields,
  DpsSortField,
} from 'src/app/model/damage-sim/sort.model';
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

    theoretical_dps: { sortOrder: SortOrder.Ascending, isSorted: false },
    max_hit: { sortOrder: SortOrder.Ascending, isSorted: false },
    accuracy: { sortOrder: SortOrder.Ascending, isSorted: false },
    sim_dps_stats: { sortOrder: SortOrder.Ascending, isSorted: false },
    total_damage_stats: { sortOrder: SortOrder.Ascending, isSorted: false },
    attack_count_stats: { sortOrder: SortOrder.Ascending, isSorted: false },
  };

  SortOrder = SortOrder;
  timeSortFields = timeSortFields;
  dpsSortFields = dpsSortFields;
  sortLabels = sortLabels;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['damageSimResults']) this.sortTimeResults('average');
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
    return +matches[1] * 60 + +matches[2] + +matches[3] / 10;
  }

  sortTimeResults(timeSortField: TimeSortField): void {
    const sortOrder = this.sortConfigs[timeSortField].sortOrder;

    this.damageSimResults.results.sort(
      (result1: DamageSimResult, result2: DamageSimResult) =>
        sortOrder *
        (this.convertTimeStringToSeconds(result1.ttk_stats[timeSortField] as string) -
          this.convertTimeStringToSeconds(result2.ttk_stats[timeSortField] as string))
    );

    this.updateSortConfigs(timeSortField);
  }

  sortDpsResults(dpsSortField: DpsSortField): void {
    const sortOrder = this.sortConfigs[dpsSortField].sortOrder;

    this.damageSimResults.results.sort((result1: DamageSimResult, result2: DamageSimResult) =>
      typeof result1[dpsSortField][0] === 'number'
        ? sortOrder * (result1[dpsSortField][0] - result2[dpsSortField][0])
        : sortOrder * (result1[dpsSortField][0].average - result2[dpsSortField][0].average)
    );

    this.updateSortConfigs(dpsSortField);
  }

  updateSortConfigs(sortField: TimeSortField | DpsSortField): void {
    this.timeSortFields.forEach((field: TimeSortField) => (this.sortConfigs[field].isSorted = false));
    this.dpsSortFields.forEach((field: TimeSortField) => (this.sortConfigs[field].isSorted = false));

    this.sortConfigs[sortField].isSorted = true;
    this.sortConfigs[sortField].sortOrder = this.sortConfigs[sortField].sortOrder * -1;
  }
}
