import { Component } from '@angular/core';
import { DamageSimResults } from 'src/app/model/damage-sim/damage-sim-results.model';
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

  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}

  runDamageSim(): void {
    this.loading = true;

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
}
