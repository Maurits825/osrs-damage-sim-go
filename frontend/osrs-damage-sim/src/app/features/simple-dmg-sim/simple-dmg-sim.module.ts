import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimpleDmgSimRoutingModule } from './simple-dmg-sim-routing.module';
import { SimpleDmgSimComponent } from './simple-dmg-sim.component';
import { FormsModule } from '@angular/forms';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { SimpleSimSettingsComponent } from './simple-sim-settings/simple-sim-settings.component';

@NgModule({
  declarations: [SimpleDmgSimComponent, SimpleSimSettingsComponent],
  imports: [CommonModule, FormsModule, SimpleDmgSimRoutingModule, AppSharedModule],
})
export class SimpleDmgSimModule {}
