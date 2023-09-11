import { Component, OnDestroy, OnInit } from '@angular/core';
import { forIn } from 'lodash-es';
import { Subject, takeUntil } from 'rxjs';
import { statDrainLabels } from 'src/app/model/damage-sim/stat-drain.model';
import { DpsGrapherSettings } from 'src/app/model/dps-grapher/dps-grapher-settings.model';
import { InputValue, InputValueType, inputValues } from 'src/app/model/dps-grapher/input-values.model';
import { InputSetupService } from 'src/app/services/input-setup.service';

@Component({
  selector: 'app-dps-grapher-settings',
  templateUrl: './dps-grapher-settings.component.html',
  styleUrls: ['./dps-grapher-settings.component.css'],
})
export class DpsGrapherSettingsComponent implements OnInit, OnDestroy {
  InputValue: InputValue;

  inputValues = inputValues;

  selectedInputValue: InputValue;

  dpsGrapherSettings: DpsGrapherSettings;

  private destroyed$ = new Subject();

  constructor(private inputSetupService: InputSetupService) {}

  ngOnInit(): void {
    forIn(statDrainLabels, (label, type) =>
      this.inputValues.push({
        type: type as InputValueType,
        label,
      })
    );
    this.inputSetupService.dpsGrapherSettings$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((dpsGrapherSettings: DpsGrapherSettings) => {
        this.dpsGrapherSettings = dpsGrapherSettings;
        this.selectedInputValue = inputValues.find((value) => value.type === this.dpsGrapherSettings.type);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  selectedInputValueChange(inputValue: InputValue): void {
    this.selectedInputValue = inputValue;
    this.dpsGrapherSettings.type = inputValue.type;

    this.inputSetupService.dpsGrapherSettings$.next(this.dpsGrapherSettings);
  }

  minChanged(): void {
    this.inputSetupService.dpsGrapherSettings$.next(this.dpsGrapherSettings);
  }

  maxChanged(): void {
    this.inputSetupService.dpsGrapherSettings$.next(this.dpsGrapherSettings);
  }
}
