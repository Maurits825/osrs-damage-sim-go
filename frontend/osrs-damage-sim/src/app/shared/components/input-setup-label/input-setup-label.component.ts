import { Component, Input } from '@angular/core';
import { DpsCalcResult } from 'src/app/model/dps-calc/dps-results.model';
import { InputGearSetup } from 'src/app/model/dps-calc/input-setup.model';

@Component({
  selector: 'app-input-setup-label',
  templateUrl: './input-setup-label.component.html',
})
export class InputSetupLabelComponent {
  @Input()
  showTextLabel: boolean;

  @Input()
  dpsCalcResult: DpsCalcResult;

  @Input()
  inputGearSetup: InputGearSetup;
}
