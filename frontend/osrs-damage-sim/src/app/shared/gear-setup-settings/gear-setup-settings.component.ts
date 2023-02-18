import { Component } from '@angular/core';
import { StatDrain } from 'src/app/model/damage-sim/stat-drain.model';

@Component({
  selector: 'app-gear-setup-settings',
  templateUrl: './gear-setup-settings.component.html',
  styleUrls: ['./gear-setup-settings.component.css'],
})
export class GearSetupSettingsComponent {
  statDrains: StatDrain[] = [];
  statDrainChanged(statDrain: StatDrain[]): void {}
}
