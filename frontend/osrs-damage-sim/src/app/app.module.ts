import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppComponent } from './app.component';
import { GearSetupComponent } from './gear-setup/gear-setup.component';
import { WikiItemIconPipe } from './pipes/wiki-item-icon.pipe';
import { DamageSimService } from './services/damage-sim.service';
import { GearSetupService } from './services/gear-setups.service';
import { RlGearService } from './services/rl-gear.service';
import { GearSetupTabComponent } from './gear-setup-tab/gear-setup-tab.component';
import { GearSetupTabsComponent } from './gear-setup-tabs/gear-setup-tabs.component';
import { NpcInputComponent } from './npc-input/npc-input.component';
import { GlobalBoostComponent } from './global-boost/global-boost.component';
import { GlobalBoostService } from './services/global-boost.service';

@NgModule({
  declarations: [
    AppComponent,
    GearSetupComponent,
    WikiItemIconPipe,
    GearSetupTabComponent,
    GearSetupTabsComponent,
    NpcInputComponent,
    GlobalBoostComponent,
  ],
  imports: [
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    DamageSimService,
    RlGearService,
    GearSetupService,
    GlobalBoostService,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
