import { Component, OnInit } from '@angular/core';
import { forkJoin, take } from 'rxjs';
import { ExampleSetup } from 'src/app/model/damage-sim/example-setup.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { InputSetupService } from 'src/app/services/input-setup.service';

@Component({
  selector: 'app-example-setups',
  templateUrl: './example-setups.component.html',
  styleUrls: ['./example-setups.component.css'],
})
export class ExampleSetupsComponent implements OnInit {
  exampleSetups: ExampleSetup[];

  dmgSimExampleSetups: ExampleSetup[];
  dpsGrapherExampleSetups: ExampleSetup[];
  selectedSetup: ExampleSetup;

  ExampleSetup: ExampleSetup;

  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}

  ngOnInit(): void {
    forkJoin([this.damageSimservice.dmgSimExampleSetups$, this.damageSimservice.dpsGrapherExampleSetups$])
      .pipe(take(1))
      .subscribe(([dmgSimExampleSetups, dpsGrapherExampleSetups]) => {
        this.dmgSimExampleSetups = dmgSimExampleSetups;
        this.dpsGrapherExampleSetups = dpsGrapherExampleSetups;

        this.exampleSetups = this.dmgSimExampleSetups;
      });
  }

  selectedSetupChange(exampleSetup: ExampleSetup): void {
    if (!exampleSetup) return;

    const inputSetup = this.inputSetupService.parseInputSetupFromEncodedString(exampleSetup.setupString);
    this.inputSetupService.loadInputSetup$.next(inputSetup);

    // const dpsGrapherInput = this.inputSetupService.parseDpsGrapherInputFromEncodedString(exampleSetup.setupString);
    // this.inputSetupService.loadInputSetup$.next(dpsGrapherInput.inputSetup);
    // this.inputSetupService.dpsGrapherSettings$.next(dpsGrapherInput.settings);
  }
}
