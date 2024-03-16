import { Component } from '@angular/core';
import { DpsResults } from 'src/app/model/damage-sim/dps-results.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { InputSetupService } from 'src/app/services/input-setup.service';

@Component({
  selector: 'app-dps-calc',
  templateUrl: './dps-calc.component.html',
})
export class DpsCalcComponent {
  loading = false;

  dpsResults: DpsResults;

  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}

  runDpsCalc(): void {
    this.loading = true;
    this.clearResults();
    const inputSetupJson = this.inputSetupService.getInputSetupAsJson();

    this.damageSimservice.runDpsCalc(inputSetupJson).subscribe({
      next: (results: DpsResults) => {
        this.loading = false;
        this.dpsResults = results;
      },
      error: (error) => {
        this.loading = false;
        this.dpsResults = { ...this.dpsResults, error: error.statusText };
      },
    });
  }

  clearResults(): void {
    this.dpsResults = null;
  }
}
