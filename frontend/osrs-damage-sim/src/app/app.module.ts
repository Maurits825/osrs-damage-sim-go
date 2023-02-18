import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppComponent } from './app.component';
import { GearSetupComponent } from './shared/gear-setup/gear-setup.component';
import { GearSetupTabComponent } from './shared/gear-setup-tab/gear-setup-tab.component';
import { GearSetupTabsComponent } from './core/gear-setup-tabs/gear-setup-tabs.component';
import { NpcInputComponent } from './shared/npc-input/npc-input.component';
import { ConditionComponent } from './shared/condition/condition.component';
import { SimResultsComponent } from './core/sim-results/sim-results.component';
import { Base64ImagePipe } from './shared/pipes/base64-image.pipe';
import { GlobalSettingsComponent } from './core/global-settings/global-settings.component';
import { BoostSelectionComponent } from './shared/boost-selection/boost-selection.component';
import { PrayerSelectionComponent } from './shared/prayer-selection/prayer-selection.component';
import { PrayerModalComponent } from './shared/prayer-modal/prayer-modal.component';
import { BoostModalComponent } from './shared/boost-modal/boost-modal.component';
import { SpecialGearComponent } from './shared/special-gear/special-gear.component';
import { CombatStatSelectionComponent } from './shared/combat-stat-selection/combat-stat-selection.component';
import { StatDrainSelectionComponent } from './shared/stat-drain-selection/stat-drain-selection.component';
import { GearSetupSettingsComponent } from './shared/gear-setup-settings/gear-setup-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    GearSetupComponent,
    GearSetupTabComponent,
    GearSetupTabsComponent,
    NpcInputComponent,
    ConditionComponent,
    SimResultsComponent,
    Base64ImagePipe,
    BoostSelectionComponent,
    GlobalSettingsComponent,
    PrayerSelectionComponent,
    PrayerModalComponent,
    BoostModalComponent,
    SpecialGearComponent,
    CombatStatSelectionComponent,
    StatDrainSelectionComponent,
    GearSetupSettingsComponent,
  ],
  imports: [NgSelectModule, FormsModule, ReactiveFormsModule, BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
