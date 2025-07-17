import { Component, Input } from '@angular/core';
import { InputSetup } from 'src/app/model/simple-dmg-sim/input-setup.model';

@Component({
  selector: 'app-sim-input-setup-label',
  templateUrl: './input-setup-label.component.html',
})
export class InputSetupLabelComponent {
  @Input()
  inputSetup: InputSetup;

  @Input()
  inputIndex: number;
}
