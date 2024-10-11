import { Component } from '@angular/core';

@Component({
  selector: 'app-simple-dmg-sim',
  templateUrl: './simple-dmg-sim.component.html',
})
export class SimpleDmgSimComponent {
  loading = false;

  simpleDmgSimResults: any = null;

  runSimpleDmgSimCalc(): void {
    console.log('run dmg sim');
  }
}
