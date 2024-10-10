import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DpsCalcRoutingModule } from './dps-calc-routing.module';
import { DpsCalcComponent } from './dps-calc.component';
import { CalcDetailsComponent } from './dps-results/calc-details/calc-details.component';
import { DpsGraphComponent } from './dps-results/dps-graph/dps-graph.component';
import { DpsResultsComponent } from './dps-results/dps-results.component';
import { HitDistGraphComponent } from './dps-results/hit-dist-graph/hit-dist-graph.component';
import { ExampleSetupsComponent } from './example-setups/example-setups.component';
import { GearSetupTabsComponent } from './gear-setup-tabs/gear-setup-tabs.component';
import { ShareInputSetupComponent } from './share-input-setup/share-input-setup.component';
import { WikiDpsShortlinkComponent } from './wiki-dps-shortlink/wiki-dps-shortlink.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalSettingsComponent } from './global-settings/global-settings.component';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DpsCalcComponent,
    GearSetupTabsComponent,
    ExampleSetupsComponent,
    DpsCalcComponent,
    DpsResultsComponent,
    HitDistGraphComponent,
    DpsGraphComponent,
    CalcDetailsComponent,
    ShareInputSetupComponent,
    WikiDpsShortlinkComponent,
    GlobalSettingsComponent,
  ],
  imports: [CommonModule, FormsModule, DpsCalcRoutingModule, NgbPopoverModule, AppSharedModule],
})
export class DpsCalcModule {}
