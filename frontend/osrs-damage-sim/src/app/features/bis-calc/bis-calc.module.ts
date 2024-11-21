import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BisCalcRoutingModule } from './bis-calc-routing.module';
import { BisCalcComponent } from './bis-calc.component';
import { BisCalcResultsComponent } from './bis-calc-results/bis-calc-results.component';
import { BisCalcSettingsComponent } from './bis-calc-settings/bis-calc-settings.component';
import { FormsModule } from '@angular/forms';
import { AppSharedModule } from 'src/app/shared/app-shared.module';

@NgModule({
  declarations: [BisCalcComponent, BisCalcResultsComponent, BisCalcSettingsComponent],
  imports: [CommonModule, FormsModule, BisCalcRoutingModule, AppSharedModule],
})
export class BisCalcModule {}
