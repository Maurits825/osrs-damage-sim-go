import { Component, Input } from '@angular/core';
import { GearSetupSettings } from 'src/app/model/shared/gear-setup-settings.model';
import { GearSetup } from 'src/app/model/shared/gear-setup.model';

@Component({
  selector: 'app-input-setup-label',
  templateUrl: './input-setup-label.component.html',
})
export class InputSetupLabelComponent {
  @Input()
  gearSetupSettings: GearSetupSettings;

  @Input()
  gearSetup: GearSetup;
}
