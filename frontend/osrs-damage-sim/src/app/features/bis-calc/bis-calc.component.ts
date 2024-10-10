import { Component } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { BisCalcInputSetup } from 'src/app/model/damage-sim/bis-calc-input.model';
import { BisCalcResults } from 'src/app/model/damage-sim/bis-calc-result.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { InputSetupService } from 'src/app/services/input-setup.service';

@Component({
  selector: 'app-bis-calc',
  templateUrl: './bis-calc.component.html',
})
export class BisCalcComponent {
  loading = false;

  bisCalcInputSetup: BisCalcInputSetup;
  currentBisCalcInputSetup: BisCalcInputSetup;
  bisResults: BisCalcResults;

  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}

  onBisCalcInputSetupChanged(bisCalcInputSetup: BisCalcInputSetup): void {
    this.currentBisCalcInputSetup = bisCalcInputSetup;
  }

  runBisCalc(): void {
    this.loading = true;
    this.clearResults();
    const inputSetupJson = this.inputSetupService.convertInputObjectToJson(this.currentBisCalcInputSetup);

    this.damageSimservice.runBisCalc(inputSetupJson).subscribe({
      next: (results: BisCalcResults) => {
        this.loading = false;
        this.bisResults = results;
        this.bisCalcInputSetup = cloneDeep(this.currentBisCalcInputSetup);
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
