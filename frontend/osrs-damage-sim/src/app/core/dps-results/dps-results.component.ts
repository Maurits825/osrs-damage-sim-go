import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DpsResults } from 'src/app/model/damage-sim/dps-results.model';
import { SortConfigs, SortOrder, dpsSortFields, sortLabels, DpsSortField } from 'src/app/model/damage-sim/sort.model';
import { InputSetup } from 'src/app/model/damage-sim/input-setup.model';
import { InputSetupService } from 'src/app/services/input-setup.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { UserSettings } from 'src/app/model/damage-sim/user-settings.model';
import { cloneDeep } from 'lodash-es';
import { CALC_DETAILS_TAB, RESULT_TABS, ResultTab, ResultType } from './result-tab.model';

@Component({
  selector: 'app-dps-results',
  templateUrl: './dps-results.component.html',
})
export class DpsResultsComponent implements OnInit, OnChanges {
  @Input()
  dpsResults: DpsResults;

  resultTabs = RESULT_TABS;
  ResultType = ResultType;
  activeResultTab: ResultTab = RESULT_TABS[0];

  sortIndexOrder: number[];
  sortConfigs: Partial<SortConfigs> = {
    theoreticalDps: { sortOrder: SortOrder.Ascending, isSorted: false },
    maxHit: { sortOrder: SortOrder.Ascending, isSorted: false },
    accuracy: { sortOrder: SortOrder.Ascending, isSorted: false },
    attackRoll: { sortOrder: SortOrder.Ascending, isSorted: false },
  };

  SortOrder = SortOrder;
  dpsSortFields = dpsSortFields;
  sortLabels = sortLabels;
  showResultTextLabel$: Observable<boolean>;
  inputSetup: InputSetup;

  constructor(
    private cd: ChangeDetectorRef,
    private inputSetupService: InputSetupService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.showResultTextLabel$ = this.localStorageService.userSettingsWatch$.pipe(
      map((userSettings: UserSettings) => userSettings.showTextLabels),
      shareReplay(1)
    );

    this.localStorageService.userSettingsWatch$
      .pipe(map((userSettings: UserSettings) => userSettings.enableDebugTracking))
      .subscribe((enableDebugTracking: boolean) => {
        enableDebugTracking ? (this.resultTabs = [...RESULT_TABS, CALC_DETAILS_TAB]) : (this.resultTabs = RESULT_TABS);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dpsResults'] && this.dpsResults && !this.dpsResults.error) {
      this.sortConfigs.theoreticalDps.sortOrder = SortOrder.Descending;
      this.sortIndexOrder = [...Array(this.dpsResults.dpsCalcResults.results.length).keys()];

      this.sortDpsResults('theoreticalDps');

      this.inputSetup = cloneDeep(this.inputSetupService.getInputSetup());

      this.cd.detectChanges();
    }
  }

  sortDpsResults(dpsSortField: DpsSortField): void {
    const sortOrder = this.sortConfigs[dpsSortField].sortOrder;
    this.sortIndexOrder.sort((index1: number, index2: number) => {
      const result1 = this.dpsResults.dpsCalcResults.results[index1][dpsSortField];
      const result2 = this.dpsResults.dpsCalcResults.results[index2][dpsSortField];

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
