import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { GearSetupTabComponent } from './shared/gear-setup-tab/gear-setup-tab.component';
import { GearSetupTabsComponent } from './core/gear-setup-tabs/gear-setup-tabs.component';
import { GearSetupComponent } from './shared/gear-setup/gear-setup.component';
import { GlobalSettingsComponent } from './core/global-settings/global-settings.component';
import { DamageSimResults } from './model/damage-sim/damage-sim-results.model';
import { InputGearSetup, InputSetup } from './model/damage-sim/input-setup.model';
import { DamageSimService } from './services/damage-sim.service';
import { InputSetupService } from './services/input-setup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild(GearSetupTabsComponent) gearSetupTabsComponent: GearSetupTabsComponent;
  @ViewChild(GlobalSettingsComponent) globalSettingsComponent: GlobalSettingsComponent;

  loading = false;

  damageSimResults: DamageSimResults;

  isDamageSimActive = false;

  constructor(private damageSimservice: DamageSimService, private gearSetupTabsService: InputSetupService) {}

  ngOnInit(): void {
    this.damageSimservice.getStatus().subscribe({
      next: (status) => {
        this.isDamageSimActive = true;
      },
      error: (e) => {
        this.isDamageSimActive = false;
      },
    });
  }

  runDamageSim(): void {
    this.loading = true;

    const inputSetup = this.gearSetupTabsService.getInputSetup(
      this.globalSettingsComponent.globalSettings,
      this.gearSetupTabsComponent
    );

    this.damageSimservice.runDamageSim(inputSetup).subscribe(
      (results: DamageSimResults) => {
        this.damageSimResults = results;
        this.loading = false;
      },
      (error) => {
        //TODO show some error
        this.loading = false;
      }
    );
  }
}
