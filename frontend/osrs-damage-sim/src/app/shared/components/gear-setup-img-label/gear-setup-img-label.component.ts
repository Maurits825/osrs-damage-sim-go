import { Component, Input } from '@angular/core';
import { InputGearSetup } from 'src/app/model/damage-sim/input-setup.model';

@Component({
  selector: 'app-gear-setup-img-label',
  templateUrl: './gear-setup-img-label.component.html',
})
export class GearSetupImgLabelComponent {
  @Input()
  inputGearSetup: InputGearSetup;
}
