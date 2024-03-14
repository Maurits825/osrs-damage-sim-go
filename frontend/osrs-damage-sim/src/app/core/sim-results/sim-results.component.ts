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
import {
  DamageSimResult,
  DamageSimResults,
  DpsResults,
  SimStats,
} from '../../model/damage-sim/damage-sim-results.model';

@Component({
  selector: 'app-sim-results',
  templateUrl: './sim-results.component.html',
  styleUrls: ['./sim-results.component.css'],
})
export class SimResultsComponent implements OnChanges {
  @Input()
  damageSimResults: DamageSimResults;

  @Input()
  dpsResults: DpsResults;

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

    targetTimeChance: { sortOrder: SortOrder.Ascending, isSorted: false },
  };

  SortOrder = SortOrder;
  timeSortFields = timeSortFields;
  dpsSortFields = dpsSortFields;
  sortLabels = sortLabels;

  isTargetTimeValid: boolean = null;
  targetTime = '';

  timestampPattern = /^(?:([0-9]{0,2}):)?([0-9]{1,2})\.([0-9]+)$/;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['damageSimResults'] && this.damageSimResults && !this.damageSimResults.error) {
      this.sortConfigs.average.sortOrder = SortOrder.Ascending;
      this.sortTimeResults('average');
      this.isTargetTimeValid = null;
      this.targetTime = '';
    }

    if (changes['dpsCalcResults'] && this.dpsResults && !this.dpsResults.error) {
      this.sortConfigs.theoretical_dps.sortOrder = SortOrder.Descending;
      this.sortDpsResults('theoretical_dps');
    }
  }

  targetTimeChanged(targetTime: string): void {
    this.isTargetTimeValid = false;

    if (!targetTime || !this.timestampPattern.test(targetTime)) return;

    const targetSeconds = this.convertTimeStringToSeconds(targetTime);
    if (targetSeconds === -1) return;

    const targetTicks = Math.ceil(targetSeconds / 0.6);

    this.damageSimResults.results.forEach((damageSimResult: DamageSimResult) => {
      const chanceIndex = Math.min(targetTicks, damageSimResult.cumulative_chances.length - 1);
      damageSimResult.targetTimeChance = damageSimResult.cumulative_chances[chanceIndex];
    });

    this.sortConfigs.targetTimeChance.sortOrder = SortOrder.Descending;
    this.sortTargetTimeChange();

    this.isTargetTimeValid = true;
  }

  convertTimeStringToSeconds(timeString: string): number {
    const matches = timeString.match(this.timestampPattern);

    const minutes = +matches[1] || 0;
    const seconds = +matches[2];
    const milliseconds = +('0.' + matches[3]);

    if (minutes >= 60 || seconds >= 60) return -1;

    return minutes * 60 + seconds + milliseconds;
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
    const results = (this.damageSimResults ? this.damageSimResults : this.dpsResults) as DamageSimResults;
    results.results.sort((result1: DamageSimResult, result2: DamageSimResult) => {
      if (typeof result1[dpsSortField] === 'number') {
        return (
          sortOrder * ((result1[dpsSortField] as unknown as number) - (result2[dpsSortField] as unknown as number))
        );
      }
      if (typeof result1[dpsSortField][0] === 'number') {
        return sortOrder * ((result1[dpsSortField][0] as number) - (result2[dpsSortField][0] as number));
      }
      return (
        sortOrder * ((result1[dpsSortField][0] as SimStats).average as number) -
        ((result2[dpsSortField][0] as SimStats).average as number)
      );
    });

    this.updateSortConfigs(dpsSortField);
  }

  sortTargetTimeChange(): void {
    const sortOrder = this.sortConfigs.targetTimeChance.sortOrder;

    this.damageSimResults.results.sort(
      (result1: DamageSimResult, result2: DamageSimResult) =>
        sortOrder * (result1.targetTimeChance - result2.targetTimeChance)
    );

    this.updateSortConfigs('targetTimeChance');
  }

  updateSortConfigs(sortField: TimeSortField | DpsSortField | 'targetTimeChance'): void {
    this.timeSortFields.forEach((field: TimeSortField) => (this.sortConfigs[field].isSorted = false));
    this.dpsSortFields.forEach((field: DpsSortField) => (this.sortConfigs[field].isSorted = false));

    this.sortConfigs['targetTimeChance'].isSorted = false;

    this.sortConfigs[sortField].isSorted = true;
    this.sortConfigs[sortField].sortOrder *= -1;
  }
}
