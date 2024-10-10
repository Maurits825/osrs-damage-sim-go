import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DpsCalcComponent } from './core/dps-calc/dps-calc.component';
import { BisCalcComponent } from './core/bis-calc/bis-calc.component';
import { SimpleDmgSimComponent } from './core/simple-dmg-sim/simple-dmg-sim.component';

const routes: Routes = [
  { path: 'dps-calc', component: DpsCalcComponent },
  { path: 'simple-dmg-sim', component: SimpleDmgSimComponent },
  { path: 'bis-calc', component: BisCalcComponent },
  { path: '', redirectTo: '/dps-calc', pathMatch: 'full' },
  { path: '**', redirectTo: '/dps-calc', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
