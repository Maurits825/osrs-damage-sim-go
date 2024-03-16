import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ExampleSetup } from 'src/app/model/damage-sim/example-setup.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { InputSetupService } from 'src/app/services/input-setup.service';

@Component({
  selector: 'app-example-setups',
  templateUrl: './example-setups.component.html',
})
export class ExampleSetupsComponent implements OnInit {
  exampleSetups: ExampleSetup[];

  dmgSimExampleSetups: ExampleSetup[];
  dpsGrapherExampleSetups: ExampleSetup[];
  selectedSetup: ExampleSetup;

  ExampleSetup: ExampleSetup;

  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}

  ngOnInit(): void {
    this.damageSimservice.dmgSimExampleSetups$.pipe(take(1)).subscribe((dmgSimExampleSetups) => {
      this.dmgSimExampleSetups = dmgSimExampleSetups;

      this.exampleSetups = this.dmgSimExampleSetups;
    });
  }

  selectedSetupChange(exampleSetup: ExampleSetup): void {
    if (!exampleSetup) return;

    const inputSetup = this.inputSetupService.parseInputSetupFromEncodedString(exampleSetup.setupString);
    this.inputSetupService.loadInputSetup$.next(inputSetup);
  }
}
