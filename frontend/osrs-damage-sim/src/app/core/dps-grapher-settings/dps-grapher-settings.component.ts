import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DpsGrapherSettings } from 'src/app/model/dps-grapher/dps-grapher-settings.model';
import { InputValue, inputValues } from 'src/app/model/dps-grapher/input-values.model';
import { InputSetupService } from 'src/app/services/input-setup.service';

@Component({
  selector: 'app-dps-grapher-settings',
  templateUrl: './dps-grapher-settings.component.html',
  styleUrls: ['./dps-grapher-settings.component.css'],
})
export class DpsGrapherSettingsComponent implements OnInit, OnDestroy {
  InputValue: InputValue;

  inputValues = inputValues;

  selectedInputValue: InputValue = inputValues[0];

  dpsGrapherSettings: DpsGrapherSettings;

  private destroyed$ = new Subject();

  constructor(private inputSetupService: InputSetupService) {}

  ngOnInit(): void {
    this.inputSetupService.dpsGrapherSettings$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((dpsGrapherSettings: DpsGrapherSettings) => (this.dpsGrapherSettings = dpsGrapherSettings));
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
