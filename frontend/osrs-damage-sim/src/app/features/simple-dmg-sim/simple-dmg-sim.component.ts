import { Component } from '@angular/core';
import { GearSetup } from 'src/app/model/shared/gear-setup.model';
import { SimpleSimResults } from 'src/app/model/simple-dmg-sim/simple-sim-results.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { SimpleDmgSimInputService } from 'src/app/services/simple-dmg-sim-input.service';

@Component({
  selector: 'app-simple-dmg-sim',
  templateUrl: './simple-dmg-sim.component.html',
})
export class SimpleDmgSimComponent {
  loading = false;

  simpleSimResults: SimpleSimResults = null;

  activeTab: 'preset-editor' | 'gear-setup-tabs' = 'gear-setup-tabs';

  selectedGearSetup: GearSetup | null = null;

  constructor(private damageSimservice: DamageSimService, private inputService: SimpleDmgSimInputService) {}

  runSimpleDmgSimCalc(): void {
    this.loading = true;
    this.simpleSimResults = null;

    const inputSetupJson = this.inputService.getInputSetupAsJson();

    this.damageSimservice.runSimpleSim(inputSetupJson).subscribe({
      next: (results: SimpleSimResults) => {
        this.loading = false;
        this.simpleSimResults = results;
      },
      error: ({ error: { error } }) => {
        this.loading = false;
        const errorMessage = error ? error[0].toUpperCase() + error.slice(1) : 'Unkown error';
        this.simpleSimResults = { ...this.simpleSimResults, error: errorMessage };
      },
    });
  }

  onSelectGearSetup(gearSetup: GearSetup) {
    this.selectedGearSetup = gearSetup;
    this.activeTab = 'preset-editor';
  }
}
