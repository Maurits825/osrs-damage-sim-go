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
  ],
  imports: [NgSelectModule, FormsModule, ReactiveFormsModule, BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
