import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppComponent } from './app.component';
import { GearSetupComponent } from './shared/components/gear-setup/gear-setup.component';
import { GearSetupTabComponent } from './shared/components/gear-setup-tab/gear-setup-tab.component';
import { GearSetupTabsComponent } from './core/gear-setup-tabs/gear-setup-tabs.component';
import { NpcInputComponent } from './shared/components/npc-input/npc-input.component';
import { ConditionComponent } from './shared/components/condition/condition.component';
import { SimResultsComponent } from './core/sim-results/sim-results.component';
import { Base64ImagePipe } from './shared/pipes/base64-image.pipe';
import { GlobalSettingsComponent } from './core/global-settings/global-settings.component';
import { BoostSelectionComponent } from './shared/components/boost-selection/boost-selection.component';
import { PrayerSelectionComponent } from './shared/components/prayer-selection/prayer-selection.component';
import { PrayerModalComponent } from './shared/modals/prayer-modal/prayer-modal.component';
import { BoostModalComponent } from './shared/modals/boost-modal/boost-modal.component';
import { SpecialGearComponent } from './shared/components/special-gear/special-gear.component';
import { CombatStatSelectionComponent } from './shared/components/combat-stat-selection/combat-stat-selection.component';
import { StatDrainSelectionComponent } from './shared/components/stat-drain-selection/stat-drain-selection.component';
import { GearSetupSettingsComponent } from './shared/components/gear-setup-settings/gear-setup-settings.component';
import { NgSelectLazyLoadComponent } from './shared/components/ng-select-lazy-load/ng-select-lazy-load.component';
import { ShareInputSetupComponent } from './core/share-input-setup/share-input-setup.component';
import { ShareInputSetupModalComponent } from './shared/modals/share-input-setup-modal/share-input-setup-modal.component';
import { ClipboardModule } from 'ngx-clipboard';
import { GEAR_SETUP_TOKEN, INPUT_GEAR_SETUP_TOKEN } from './model/damage-sim/injection-token.const';
import { QuickGearSelectComponent } from './shared/components/quick-gear-select/quick-gear-select.component';
import { ExampleSetupsComponent } from './core/example-setups/example-setups.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { DetailedRunResultsComponent } from './core/detailed-run-results/detailed-run-results.component';
import { TickToTimePipe } from './shared/pipes/tick-to-time.pipe';
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
    NgSelectLazyLoadComponent,
    ShareInputSetupComponent,
    ShareInputSetupModalComponent,
    QuickGearSelectComponent,
    ExampleSetupsComponent,
    DetailedRunResultsComponent,
    TickToTimePipe,
  ],
  imports: [NgSelectModule, FormsModule, BrowserModule, HttpClientModule, ClipboardModule, NgbPopoverModule],
  providers: [
    { provide: INPUT_GEAR_SETUP_TOKEN, useValue: null },
    { provide: GEAR_SETUP_TOKEN, useValue: null },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
