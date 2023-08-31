import { Component } from '@angular/core';
import { DamageSimResults } from 'src/app/model/damage-sim/damage-sim-results.model';
import { DpsGrapherSettings } from 'src/app/model/dps-grapher/dps-grapher-settings.model';
import { Mode } from 'src/app/model/mode.enum';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { InputSetupService } from 'src/app/services/input-setup.service';

@Component({
  selector: 'app-dps-grapher',
  templateUrl: './dps-grapher.component.html',
  styleUrls: ['./dps-grapher.component.css'],
})
export class DpsGrapherComponent {
  Mode = Mode;

  loading = false;

  damageSimResults: DamageSimResults;

  dpsGrapherSettings: DpsGrapherSettings;

  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}

  dpsGrapherSettingsChanged(dpsGrapherSettings: DpsGrapherSettings): void {
    this.dpsGrapherSettings = dpsGrapherSettings;
    console.log(this.dpsGrapherSettings);
  }

  runDpsGrapher(): void {
    this.loading = true;

    const inputSetupJson = this.inputSetupService.getInputSetupAsJson();

    //TODO service
    this.damageSimservice.runDamageSim(inputSetupJson).subscribe({
      next: (results: DamageSimResults) => {
        this.loading = false;
        this.damageSimResults = results;
      },
      error: (error) => {
        this.loading = false;
        this.damageSimResults = { ...this.damageSimResults, error: error.statusText };
      },
    });
  }
}
