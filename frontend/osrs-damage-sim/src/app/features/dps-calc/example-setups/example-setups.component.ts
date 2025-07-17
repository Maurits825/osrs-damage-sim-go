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
  exampleSetups: ExampleSetup<string>[];
  selectedSetup: ExampleSetup<string>;

  ExampleSetup: ExampleSetup<string>;

  constructor(
    private staticDataService: StaticDataService,
    private inputSetupService: DpsCalcInputService,
  ) {}

  ngOnInit(): void {
    this.staticDataService.dpsCalcExampleSetups$.pipe(take(1)).subscribe((exampleSetups) => {
      this.exampleSetups = exampleSetups;
    });
  }

  selectedSetupChange(exampleSetup: ExampleSetup<string>): void {
    if (!exampleSetup) return;

    const inputSetup = this.inputSetupService.parseInputSetupFromEncodedString(exampleSetup.inputSetup);
    this.inputSetupService.loadInputSetup$.next(inputSetup);
  }
}
