import { Component } from '@angular/core';
import { DpsResults } from 'src/app/model/damage-sim/dps-results.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { DpsCalcInputService } from 'src/app/services/dps-calc-input.service';

@Component({
  selector: 'app-dps-calc',
  templateUrl: './dps-calc.component.html',
})
export class DpsCalcComponent {
  loading = false;

  dpsResults: DpsResults;

  constructor(private damageSimservice: DamageSimService, private inputSetupService: DpsCalcInputService) {}

  runDpsCalc(): void {
    this.loading = true;
    this.clearResults();
    const inputSetupJson = this.inputSetupService.getInputSetupAsJson();

    this.damageSimservice.runDpsCalc(inputSetupJson).subscribe({
      next: (results: DpsResults) => {
        this.loading = false;
        this.dpsResults = results;
      },
      error: ({ error: { error } }) => {
        this.loading = false;
        const errorMessage = error[0].toUpperCase() + error.slice(1);
        this.dpsResults = { ...this.dpsResults, error: errorMessage };
      },
    });
  }

  clearResults(): void {
    this.dpsResults = null;
  }
}
