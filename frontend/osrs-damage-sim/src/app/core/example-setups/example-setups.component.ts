import { Component, Input, OnInit } from '@angular/core';
import { ExampleSetup } from 'src/app/model/damage-sim/example-setup.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { InputSetupService } from 'src/app/services/input-setup.service';
import { GearSetupTabsComponent } from '../gear-setup-tabs/gear-setup-tabs.component';
import { GlobalSettingsComponent } from '../global-settings/global-settings.component';

@Component({
  selector: 'app-example-setups',
  templateUrl: './example-setups.component.html',
  styleUrls: ['./example-setups.component.css'],
})
export class ExampleSetupsComponent implements OnInit {
  @Input() globalSettingsComponent: GlobalSettingsComponent;
  @Input() gearSetupTabsComponent: GearSetupTabsComponent;

  exampleSetups: ExampleSetup[];
  selectedSetup: ExampleSetup;

  ExampleSetup: ExampleSetup;

  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}

  ngOnInit(): void {
    this.damageSimservice.exampleSetups$.subscribe((exampleSetups: ExampleSetup[]) => {
      this.exampleSetups = exampleSetups;
    });
  }

  selectedSetupChange(exampleSetup: ExampleSetup): void {
    const inputSetup = this.inputSetupService.parseInputSetupFromEncodedString(exampleSetup.setupString);

    this.gearSetupTabsComponent.loadInputSetup(inputSetup);
    this.globalSettingsComponent.setGlobalSettings(inputSetup.globalSettings);
  }
}
