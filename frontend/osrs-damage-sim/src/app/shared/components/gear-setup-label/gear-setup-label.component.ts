import { Component, Input } from '@angular/core';
import { GearSetup } from 'src/app/model/shared/gear-setup.model';

@Component({
  selector: 'app-gear-setup-label',
  templateUrl: './gear-setup-label.component.html',
})
export class GearSetupLabelComponent {
  @Input()
  gearSetup: GearSetup;
}
