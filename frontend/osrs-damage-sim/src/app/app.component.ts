import { Component, OnInit, ViewChild } from '@angular/core';
import { GearSetupTabsComponent } from './core/gear-setup-tabs/gear-setup-tabs.component';
import { GlobalSettingsComponent } from './core/global-settings/global-settings.component';
import { DamageSimResults } from './model/damage-sim/damage-sim-results.model';
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

  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}

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

    const inputSetupJson = this.inputSetupService.getInputSetupAsJson(
      this.globalSettingsComponent.globalSettings,
      this.gearSetupTabsComponent
    );

    this.damageSimservice.runDamageSim(inputSetupJson).subscribe(
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
