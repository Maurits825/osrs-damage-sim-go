import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DpsCalcComponent } from './dps-calc.component';

const routes: Routes = [{ path: '', component: DpsCalcComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DpsCalcRoutingModule { }
