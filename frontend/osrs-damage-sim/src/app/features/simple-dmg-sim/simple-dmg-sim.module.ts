import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimpleDmgSimRoutingModule } from './simple-dmg-sim-routing.module';
import { SimpleDmgSimComponent } from './simple-dmg-sim.component';
import { FormsModule } from '@angular/forms';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { SimpleSimSettingsComponent } from './simple-sim-settings/simple-sim-settings.component';
import { GearSetupTabsComponent } from './gear-setup-tabs/gear-setup-tabs.component';
import { GearPresetsComponent } from './gear-presets/gear-presets.component';
import { GearSimSetupsComponent } from './gear-sim-setups/gear-sim-setups.component';

@NgModule({
  declarations: [
    SimpleDmgSimComponent,
    SimpleSimSettingsComponent,
    GearSetupTabsComponent,
    GearPresetsComponent,
    GearSimSetupsComponent,
  ],
  imports: [CommonModule, FormsModule, SimpleDmgSimRoutingModule, AppSharedModule],
})
export class SimpleDmgSimModule {}
