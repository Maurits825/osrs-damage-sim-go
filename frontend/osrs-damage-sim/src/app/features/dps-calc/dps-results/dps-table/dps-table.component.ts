import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { InputSetup } from 'src/app/model/dps-calc/input-setup.model';
import { SortOrder, DpsSortField, dpsSortFields, SortConfigs, sortLabels } from 'src/app/model/shared/sort.model';
import { UserSettings } from 'src/app/model/shared/user-settings.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DpsCalcResults } from 'src/app/model/dps-calc/dps-results.model';

@Component({
  selector: 'app-dps-table',
  templateUrl: './dps-table.component.html',
})
export class DpsTableComponent implements OnInit, OnChanges {
  @Input()
  dpsCalcResults: DpsCalcResults;

  @Input()
  inputSetup: InputSetup;

  sortIndexOrder: number[];
  sortConfigs: Partial<SortConfigs> = {
    theoreticalDps: { sortOrder: SortOrder.Ascending, isSorted: false },
    ticksToKill: { sortOrder: SortOrder.Ascending, isSorted: false },
    maxHit: { sortOrder: SortOrder.Ascending, isSorted: false },
    accuracy: { sortOrder: SortOrder.Ascending, isSorted: false },
    expectedHit: { sortOrder: SortOrder.Ascending, isSorted: false },
    attackRoll: { sortOrder: SortOrder.Ascending, isSorted: false },
  };

  SortOrder = SortOrder;
  dpsSortFields = dpsSortFields;
  sortLabels = sortLabels;
  showResultTextLabel$: Observable<boolean>;

  constructor(private cd: ChangeDetectorRef, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.showResultTextLabel$ = this.localStorageService.userSettingsWatch$.pipe(
      map((userSettings: UserSettings) => userSettings.showTextLabels),
      shareReplay(1)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dpsCalcResults'] && this.dpsCalcResults) {
      this.sortConfigs.theoreticalDps.sortOrder = SortOrder.Descending;
      this.sortIndexOrder = [...Array(this.dpsCalcResults.results.length).keys()];

      this.sortDpsResults('theoreticalDps');

      this.cd.detectChanges();
    }
  }

  sortDpsResults(dpsSortField: DpsSortField): void {
    const sortOrder = this.sortConfigs[dpsSortField].sortOrder;
    this.sortIndexOrder.sort((index1: number, index2: number) => {
      const result1 = this.dpsCalcResults.results[index1][dpsSortField];
      const result2 = this.dpsCalcResults.results[index2][dpsSortField];

      const sum = (a: number[]): number => {
        let r = 0;
        for (let i = 0; i < a.length; i++) {
          r += a[i];
        }
        return r;
      };
      const r1 = Array.isArray(result1) ? sum(result1) : result1;
      const r2 = Array.isArray(result2) ? sum(result2) : result2;

      return sortOrder * (r1 - r2);
    });

    this.updateSortConfigs(dpsSortField);
  }

  updateSortConfigs(sortField: DpsSortField): void {
    this.dpsSortFields.forEach((field: DpsSortField) => (this.sortConfigs[field].isSorted = false));

    this.sortConfigs[sortField].isSorted = true;
    this.sortConfigs[sortField].sortOrder *= -1;
  }
}
