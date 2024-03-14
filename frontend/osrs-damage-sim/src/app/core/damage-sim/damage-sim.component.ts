import { Component } from '@angular/core';
import { DamageSimResults, DpsResults } from 'src/app/model/damage-sim/damage-sim-results.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { InputSetupService } from 'src/app/services/input-setup.service';

@Component({
  selector: 'app-damage-sim',
  templateUrl: './damage-sim.component.html',
  styleUrls: ['./damage-sim.component.css'],
})
export class DamageSimComponent {
  loading = false;

  damageSimResults: DamageSimResults;
  dpsResults: DpsResults;

  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}

  runDamageSim(): void {
    this.loading = true;
    this.clearResults();
    const inputSetupJson = this.inputSetupService.getInputSetupAsJson();

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
    this.damageSimResults = null;
    this.dpsResults = null;
  }
}
