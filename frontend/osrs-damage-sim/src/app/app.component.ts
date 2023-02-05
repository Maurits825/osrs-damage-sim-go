import { Component, ComponentRef, ViewChild } from '@angular/core';
import { GearSetupTabComponent } from './gear-setup-tab/gear-setup-tab.component';
import { GearSetupTabsComponent } from './gear-setup-tabs/gear-setup-tabs.component';
import { GearSetupComponent } from './gear-setup/gear-setup.component';
import { GlobalSettingsComponent } from './global-settings/global-settings.component';
import { DamageSimResults } from './model/damage-sim-results.model';
import { GearInputSetup, GlobalSettings, InputSetup } from './model/input-setup.model';
import { DamageSimService } from './services/damage-sim.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(GearSetupTabsComponent) gearSetupTabsComponent: GearSetupTabsComponent;
  @ViewChild(GlobalSettingsComponent) globalSettingsComponent: GlobalSettingsComponent;

  loading = false;

  damageSimResults: DamageSimResults;

  constructor(private damageSimservice: DamageSimService) {}

  runDamageSim(): void {
    this.loading = true;

    const inputSetup: InputSetup = {
      globalSettings: this.globalSettingsComponent.globalSettings,
      gearInputSetups: [],
    };

    this.gearSetupTabsComponent.gearSetupTabs.forEach((gearSetupTab: GearSetupTabComponent) => {
      const gearInputSetups: GearInputSetup[] = [];
      gearSetupTab.gearSetups.forEach((gearSetupRef: ComponentRef<GearSetupComponent>) => {
        gearInputSetups.push(gearSetupRef.instance.getGearInputSetup());
      });

      inputSetup.gearInputSetups.push(gearInputSetups);
    });

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
