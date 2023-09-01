import { Component } from '@angular/core';
import { DamageSimResults } from 'src/app/model/damage-sim/damage-sim-results.model';
import { DpsGrapherResults } from 'src/app/model/dps-grapher/dps-grapher-results.model';
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

  dpsGrapherResults: DpsGrapherResults;

  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}

  runDpsGrapher(): void {
    this.loading = true;

    const dpsGrapherInputJson = this.inputSetupService.getDpsGrapherInputAsJson();

    this.damageSimservice.runDpsGrapher(dpsGrapherInputJson).subscribe({
      next: (results: DpsGrapherResults) => {
        this.loading = false;
        this.dpsGrapherResults = results;
      },
      error: (error) => {
        this.loading = false;
        this.dpsGrapherResults = { ...this.dpsGrapherResults, error: error.statusText };
      },
    });
  }
}
