import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NpcInputComponent } from './components/npc-input/npc-input.component';
import { AttackCycleComponent } from './components/attack-cycle/attack-cycle.component';
import { BoostSelectionComponent } from './components/boost-selection/boost-selection.component';
import { CombatStatSelectionComponent } from './components/combat-stat-selection/combat-stat-selection.component';
import { ConditionComponent } from './components/condition/condition.component';
import { GearSetSelectComponent } from './components/gear-set-select/gear-set-select.component';
import { InputSetupLabelComponent } from './components/input-setup-label/input-setup-label.component';
import { GearSetupSettingsComponent } from './components/gear-setup-settings/gear-setup-settings.component';
import { GearSetupComponent } from './components/gear-setup/gear-setup.component';
import { HighscoreLookupComponent } from './components/highscore-lookup/highscore-lookup.component';
import { TrailblazerRelicsComponent } from './components/leagues/trailblazer-relics/trailblazer-relics.component';
import { NgSelectLazyLoadComponent } from './components/ng-select-lazy-load/ng-select-lazy-load.component';
import { PrayerSelectionComponent } from './components/prayer-selection/prayer-selection.component';
import { QuickGearSelectComponent } from './components/quick-gear-select/quick-gear-select.component';
import { SpecialGearComponent } from './components/special-gear/special-gear.component';
import { StatDrainSelectionComponent } from './components/stat-drain-selection/stat-drain-selection.component';
import { BoostModalComponent } from './modals/boost-modal/boost-modal.component';
import { LoadRlSetupGuideModalComponent } from './modals/load-rl-setup-guide-modal/load-rl-setup-guide-modal.component';
import { PrayerModalComponent } from './modals/prayer-modal/prayer-modal.component';
import { SettingsModalComponent } from './modals/settings-modal/settings-modal.component';
import { ShareInputSetupModalComponent } from './modals/share-input-setup-modal/share-input-setup-modal.component';
import { Base64ImagePipe } from './pipes/base64-image.pipe';
import { MaxHitPipe } from './pipes/max-hit.pipe';
import { SpecialProcTextPipe } from './pipes/special-proc-text.pipe';
import { TickToTimePipe } from './pipes/tick-to-time.pipe';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangelogModalComponent } from './modals/changelog-modal/changelog-modal.component';
import { UnitTestModalComponent } from './modals/unit-test-modal/unit-test-modal.component';
import { SharedSettingsComponent } from './shared-settings/shared-settings.component';
import { GearSetupLabelComponent } from './components/gear-setup-label/gear-setup-label.component';
import { RagingEchoesComponent } from './components/leagues/raging-echoes/raging-echoes.component';
import { MultiNpcInputComponent } from './components/multi-npc-input/multi-npc-input.component';
import { NpcLabelComponent } from './components/npc-label/npc-label.component';

@NgModule({
  declarations: [
    NpcInputComponent,
    GearSetupComponent,
    ConditionComponent,
    Base64ImagePipe,
    BoostSelectionComponent,
    PrayerSelectionComponent,
    PrayerModalComponent,
    BoostModalComponent,
    SpecialGearComponent,
    CombatStatSelectionComponent,
    StatDrainSelectionComponent,
    GearSetupSettingsComponent,
    NgSelectLazyLoadComponent,
    ShareInputSetupModalComponent,
    GearSetSelectComponent,
    TickToTimePipe,
    SpecialProcTextPipe,
    QuickGearSelectComponent,
    HighscoreLookupComponent,
    TrailblazerRelicsComponent,
    AttackCycleComponent,
    SettingsModalComponent,
    LoadRlSetupGuideModalComponent,
    MaxHitPipe,
    InputSetupLabelComponent,
    ChangelogModalComponent,
    UnitTestModalComponent,
    SharedSettingsComponent,
    GearSetupLabelComponent,
    RagingEchoesComponent,
    MultiNpcInputComponent,
    NpcLabelComponent,
  ],
  exports: [
    NpcInputComponent,
    GearSetupComponent,
    ConditionComponent,
    Base64ImagePipe,
    BoostSelectionComponent,
    PrayerSelectionComponent,
    PrayerModalComponent,
    BoostModalComponent,
    SpecialGearComponent,
    CombatStatSelectionComponent,
    StatDrainSelectionComponent,
    GearSetupSettingsComponent,
    NgSelectLazyLoadComponent,
    ShareInputSetupModalComponent,
    GearSetSelectComponent,
    TickToTimePipe,
    SpecialProcTextPipe,
    QuickGearSelectComponent,
    HighscoreLookupComponent,
    TrailblazerRelicsComponent,
    AttackCycleComponent,
    SettingsModalComponent,
    LoadRlSetupGuideModalComponent,
    MaxHitPipe,
    InputSetupLabelComponent,
    ChangelogModalComponent,
    UnitTestModalComponent,
    SharedSettingsComponent,
    GearSetupLabelComponent,
    MultiNpcInputComponent,
    NpcLabelComponent,
  ],
  imports: [CommonModule, FormsModule, NgSelectModule, NgbPopoverModule],
  providers: [TickToTimePipe],
})
export class AppSharedModule {}
