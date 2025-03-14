import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ExampleSetup } from 'src/app/model/dps-calc/example-setup.model';
import { InputSetup } from 'src/app/model/simple-dmg-sim/input-setup.model';
import { SimpleDmgSimInputService } from 'src/app/services/simple-dmg-sim-input.service';
import { StaticDataService } from 'src/app/services/static-data.service';

@Component({
  selector: 'app-example-setups',
  templateUrl: './example-setups.component.html',
})
export class ExampleSetupsComponent implements OnInit {
  exampleSetups: ExampleSetup<InputSetup>[];

  selectedSetup: ExampleSetup<InputSetup>;
  ExampleSetup: ExampleSetup<InputSetup>;

  constructor(
    private staticDataService: StaticDataService,
    private inputService: SimpleDmgSimInputService,
  ) {}

  ngOnInit(): void {
    this.staticDataService.SimpleSimExampleSetups$.pipe(take(1)).subscribe((exampleSetups) => {
      this.exampleSetups = exampleSetups;
    });
  }

  selectedSetupChange(exampleSetup: ExampleSetup<InputSetup>): void {
    if (!exampleSetup) return;

    const inputSetup = this.inputService.getInputGearSetupFromJson(exampleSetup.inputSetup);
    this.inputService.loadInputSetup(inputSetup);
  }
}
