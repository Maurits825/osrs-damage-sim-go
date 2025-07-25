import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { UserSettings } from 'src/app/model/shared/user-settings.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RESULT_TABS, ResultType, ResultTab, CALC_DETAILS_TAB } from './dps-graph-tabs.model';
import { DpsGrapherResults } from 'src/app/model/dps-calc/dps-grapher-results.model';
import { InputSetup } from 'src/app/model/dps-calc/input-setup.model';
import { DpsCalcResults } from 'src/app/model/dps-calc/dps-results.model';

@Component({
  selector: 'app-dps-graph-tabs',
  templateUrl: './dps-graph-tabs.component.html',
})
export class DpsGraphTabsComponent implements OnInit {
  @Input()
  dpsGrapherResults: DpsGrapherResults;

  @Input()
  dpsCalcResults: DpsCalcResults;

  @Input()
  inputSetup: InputSetup;

  resultTabs = RESULT_TABS;
  ResultType = ResultType;
  activeResultTab: ResultTab = RESULT_TABS[0];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.localStorageService.userSettingsWatch$
      .pipe(map((userSettings: UserSettings) => userSettings.enableDebugTracking))
      .subscribe((enableDebugTracking: boolean) => {
        if (enableDebugTracking) {
          this.resultTabs = [...RESULT_TABS, CALC_DETAILS_TAB];
        } else {
          this.resultTabs = RESULT_TABS;
        }
      });
  }
}
