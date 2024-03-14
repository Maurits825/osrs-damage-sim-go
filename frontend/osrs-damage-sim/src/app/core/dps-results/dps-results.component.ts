import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  DamageSimResults,
  DpsResults,
  DamageSimResult,
  SimStats,
  DpsCalcResult,
} from 'src/app/model/damage-sim/damage-sim-results.model';
import {
  SortConfigs,
  SortOrder,
  timeSortFields,
  dpsSortFields,
  sortLabels,
  TimeSortField,
  DpsSortField,
} from 'src/app/model/damage-sim/sort.model';

@Component({
  selector: 'app-dps-results',
  templateUrl: './dps-results.component.html',
  styleUrls: ['./dps-results.component.css'],
})
export class DpsResultsComponent implements OnChanges {
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

    targetTimeChance: { sortOrder: SortOrder.Ascending, isSorted: false },
  };

  SortOrder = SortOrder;
  timeSortFields = timeSortFields;
  dpsSortFields = dpsSortFields;
  sortLabels = sortLabels;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dpsCalcResults'] && this.dpsResults && !this.dpsResults.error) {
      this.sortConfigs.theoretical_dps.sortOrder = SortOrder.Descending;
      this.sortDpsResults('theoretical_dps');
    }
  }

  sortDpsResults(dpsSortField: DpsSortField): void {
    const sortOrder = this.sortConfigs[dpsSortField].sortOrder;
    this.dpsResults.dpsCalcResults.sort((result1: DpsCalcResult, result2: DpsCalcResult) => {
      if (typeof result1[dpsSortField] === 'number') {
        return sortOrder * ((result1[dpsSortField] as number) - (result2[dpsSortField] as number));
      }
      return (
        sortOrder *
        ((result1[dpsSortField] as number[][0] as number) - (result2[dpsSortField] as number[][0] as number))
      );
    });

    this.updateSortConfigs(dpsSortField);
  }

  updateSortConfigs(sortField: TimeSortField | DpsSortField | 'targetTimeChance'): void {
    this.timeSortFields.forEach((field: TimeSortField) => (this.sortConfigs[field].isSorted = false));
    this.dpsSortFields.forEach((field: DpsSortField) => (this.sortConfigs[field].isSorted = false));

    this.sortConfigs['targetTimeChance'].isSorted = false;

    this.sortConfigs[sortField].isSorted = true;
    this.sortConfigs[sortField].sortOrder *= -1;
  }
}
