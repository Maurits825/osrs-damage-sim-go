import { Component } from '@angular/core';
import { GearSetup } from 'src/app/model/shared/gear-setup.model';

@Component({
  selector: 'app-simple-dmg-sim',
  templateUrl: './simple-dmg-sim.component.html',
})
export class SimpleDmgSimComponent {
  loading = false;

  simpleDmgSimResults: any = null;

  activeTab: 'preset-editor' | 'gear-setup-tabs' = 'preset-editor';

  gearSetupEditor: GearSetup;

  runSimpleDmgSimCalc(): void {
    console.log('run dmg sim');
  }

  onSelectGearSetup(gearSetup: GearSetup) {
    this.gearSetupEditor = gearSetup;
  }

  onGearSetupChange(gearSetup: GearSetup) {
    // this.gearSetupEditor = gearSetup;
  }
}
