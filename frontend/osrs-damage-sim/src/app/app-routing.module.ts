import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DamageSimComponent } from './core/damage-sim/damage-sim.component';
import { DpsGrapherComponent } from './core/dps-grapher/dps-grapher.component';

const routes: Routes = [
  { path: 'dmg-sim', component: DamageSimComponent },
  { path: 'dps-grapher', component: DpsGrapherComponent },
  { path: '', redirectTo: '/dmg-sim', pathMatch: 'full' },
  { path: '**', redirectTo: '/dmg-sim', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
