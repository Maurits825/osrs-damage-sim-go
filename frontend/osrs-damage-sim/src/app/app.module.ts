import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppComponent } from './app.component';
import { GearSetupComponent } from './gear-setup/gear-setup.component';
import { GearSetupTabComponent } from './gear-setup-tab/gear-setup-tab.component';
import { GearSetupTabsComponent } from './gear-setup-tabs/gear-setup-tabs.component';
import { NpcInputComponent } from './npc-input/npc-input.component';
import { ConditionComponent } from './condition/condition.component';
import { SimResultsComponent } from './sim-results/sim-results.component';
import { Base64ImagePipe } from './pipes/base64-image.pipe';
import { GlobalSettingsComponent } from './global-settings/global-settings.component';
import { PrayerSelectionComponent } from './prayer-selection/prayer-selection.component';
import { BoostSelectionComponent } from './boost-selection/boost-selection.component';

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
  ],
  imports: [NgSelectModule, FormsModule, ReactiveFormsModule, BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
