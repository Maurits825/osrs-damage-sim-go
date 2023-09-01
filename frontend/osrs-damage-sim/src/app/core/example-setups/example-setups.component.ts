import { Component, Input, OnInit } from '@angular/core';
import { forkJoin, map, take } from 'rxjs';
import { ExampleSetup } from 'src/app/model/damage-sim/example-setup.model';
import { Mode } from 'src/app/model/mode.enum';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { InputSetupService } from 'src/app/services/input-setup.service';

@Component({
  selector: 'app-example-setups',
  templateUrl: './example-setups.component.html',
  styleUrls: ['./example-setups.component.css'],
})
export class ExampleSetupsComponent implements OnInit {
  @Input()
  mode: Mode = Mode.DamageSim;

  Mode = Mode;

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

        this.exampleSetups = this.mode === Mode.DamageSim ? this.dmgSimExampleSetups : this.dpsGrapherExampleSetups;
      });
  }

  selectedSetupChange(exampleSetup: ExampleSetup): void {
    if (!exampleSetup) return;
    const inputSetup = this.inputSetupService.parseInputSetupFromEncodedString(exampleSetup.setupString);
    this.inputSetupService.loadInputSetup$.next(inputSetup);
  }
}
