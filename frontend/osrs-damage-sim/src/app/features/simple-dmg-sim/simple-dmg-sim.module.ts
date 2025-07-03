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
import { SimpleSimResultsComponent } from './simple-sim-results/simple-sim-results.component';
import { ExampleSetupsComponent } from './example-setups/example-setups.component';
import { SimGraphTabsComponent } from './simple-sim-results/sim-graph-tabs/sim-graph-tabs.component';
import { CummulativeTtkGraphComponent } from './simple-sim-results/cummulative-ttk-graph/cummulative-ttk-graph.component';
import { TtkHistogramGraphComponent } from './simple-sim-results/ttk-histogram-graph/ttk-histogram-graph.component';
import { InputSetupLabelComponent } from './simple-sim-results/input-setup-label/input-setup-label.component';
import { DetailedRunResultsComponent } from './simple-sim-results/detailed-run-results/detailed-run-results.component';

@NgModule({
  declarations: [
    SimpleDmgSimComponent,
    SimpleSimSettingsComponent,
    GearSetupTabsComponent,
    GearPresetsComponent,
    GearSimSetupsComponent,
    SimpleSimResultsComponent,
    ExampleSetupsComponent,
    SimGraphTabsComponent,
    CummulativeTtkGraphComponent,
    TtkHistogramGraphComponent,
    InputSetupLabelComponent,
    DetailedRunResultsComponent,
  ],
  imports: [CommonModule, FormsModule, SimpleDmgSimRoutingModule, AppSharedModule],
})
export class SimpleDmgSimModule {}
