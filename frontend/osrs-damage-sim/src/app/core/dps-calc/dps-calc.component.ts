import { Component } from '@angular/core';
import { BisCalcResults } from 'src/app/model/damage-sim/bis-calc-result.model';
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
  bisResults: BisCalcResults;

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
      error: ({ error: { error } }) => {
        this.loading = false;
        const errorMessage = error[0].toUpperCase() + error.slice(1);
        this.dpsResults = { ...this.dpsResults, error: errorMessage };
      },
    });
  }

  runBisCalc(): void {
    this.loading = true;
    this.clearResults();
    const inputSetupJson = this.inputSetupService.getBisCalcInputSetupAsJson();

    this.damageSimservice.runBisCalc(inputSetupJson).subscribe({
      next: (results: BisCalcResults) => {
        this.loading = false;
        this.bisResults = results;
      },
      error: ({ error: { error } }) => {
        this.loading = false;
        const errorMessage = error[0].toUpperCase() + error.slice(1);
        this.bisResults = { ...this.bisResults, error: errorMessage };
      },
    });
  }
  clearResults(): void {
    this.dpsResults = null;
    this.bisResults = null;
  }
}
