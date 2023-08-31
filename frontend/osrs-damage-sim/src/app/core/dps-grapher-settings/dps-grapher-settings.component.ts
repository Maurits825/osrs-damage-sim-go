import { Component, EventEmitter, Output } from '@angular/core';
import { DpsGrapherSettings } from 'src/app/model/dps-grapher/dps-grapher-settings.model';
import { InputValue, inputValues } from 'src/app/model/dps-grapher/input-values.model';

@Component({
  selector: 'app-dps-grapher-settings',
  templateUrl: './dps-grapher-settings.component.html',
  styleUrls: ['./dps-grapher-settings.component.css'],
})
export class DpsGrapherSettingsComponent {
  @Output()
  dpsGrapherSettingsChanged = new EventEmitter<DpsGrapherSettings>();

  InputValue: InputValue;

  inputValues = inputValues;

  selectedInputValue: InputValue = inputValues[0];

  dpsGrapherSettings: DpsGrapherSettings = {
    type: 'Dragon warhammer',
    min: 0,
    max: 0,
  };

  selectedInputValueChange(inputValue: InputValue): void {
    this.selectedInputValue = inputValue;
    this.dpsGrapherSettings.type = inputValue.type;

    this.dpsGrapherSettingsChanged.emit(this.dpsGrapherSettings);
  }

  minChanged(): void {
    this.dpsGrapherSettingsChanged.emit(this.dpsGrapherSettings);
  }

  maxChanged(): void {
    this.dpsGrapherSettingsChanged.emit(this.dpsGrapherSettings);
  }
}
