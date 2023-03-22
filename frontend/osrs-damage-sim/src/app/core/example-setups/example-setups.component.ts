import { Component, OnInit } from '@angular/core';
import { ExampleSetup } from 'src/app/model/damage-sim/example-setup.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';

@Component({
  selector: 'app-example-setups',
  templateUrl: './example-setups.component.html',
  styleUrls: ['./example-setups.component.css'],
})
export class ExampleSetupsComponent implements OnInit {
  // Todo load strings data, convert to input setup list, use this for dropdown

  exampleSetups: ExampleSetup[];
  selectedSetup: ExampleSetup;

  ExampleSetup: ExampleSetup;

  constructor(private damageSimservice: DamageSimService) {}

  ngOnInit(): void {
    this.damageSimservice.exampleSetups$.subscribe((setups: ExampleSetup[]) => {
      this.exampleSetups = setups;
    });
  }

  selectedSetupChange(exampleSetup: ExampleSetup): void {
    console.log(exampleSetup);
  }
}
