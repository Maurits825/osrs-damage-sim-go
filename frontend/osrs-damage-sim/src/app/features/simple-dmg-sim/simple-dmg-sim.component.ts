import { Component } from '@angular/core';

@Component({
  selector: 'app-simple-dmg-sim',
  templateUrl: './simple-dmg-sim.component.html',
})
export class SimpleDmgSimComponent {
  loading = false;

  simpleDmgSimResults: any = null;

  activeTab: 'preset-editor' | 'gear-setup-tabs' = 'preset-editor';

  runSimpleDmgSimCalc(): void {
    console.log('run dmg sim');
  }
}
