import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DpsCalcComponent } from './core/dps-calc/dps-calc.component';

const routes: Routes = [
  { path: 'dmg-sim', component: DpsCalcComponent },
  { path: '', redirectTo: '/dmg-sim', pathMatch: 'full' },
  { path: '**', redirectTo: '/dmg-sim', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
