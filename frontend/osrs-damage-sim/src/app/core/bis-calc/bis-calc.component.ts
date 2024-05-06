import { Component } from '@angular/core';
import { BisCalcResults } from 'src/app/model/damage-sim/bis-calc-result.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { InputSetupService } from 'src/app/services/input-setup.service';

@Component({
  selector: 'app-bis-calc',
  templateUrl: './bis-calc.component.html',
})
export class BisCalcComponent {
  loading = false;

  bisResults: BisCalcResults;

  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}
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
    this.bisResults = null;
  }
}
