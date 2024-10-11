import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ExampleSetup } from 'src/app/model/dps-calc/example-setup.model';
import { DpsCalcInputService } from 'src/app/services/dps-calc-input.service';
import { StaticDataService } from 'src/app/services/static-data.service';

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

  constructor(private staticDataService: StaticDataService, private inputSetupService: DpsCalcInputService) {}

  ngOnInit(): void {
    this.staticDataService.dmgSimExampleSetups$.pipe(take(1)).subscribe((dmgSimExampleSetups) => {
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
