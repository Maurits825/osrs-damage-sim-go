import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DamageSimComponent } from './core/damage-sim/damage-sim.component';
import { DpsGrapherComponent } from './core/dps-grapher/dps-grapher.component';

const routes: Routes = [
  { path: 'osrs-dmg-sim', component: DamageSimComponent },
  { path: 'osrs-dps-grapher', component: DpsGrapherComponent },
  { path: '', redirectTo: '/osrs-dmg-sim', pathMatch: 'full' },
]; //TODO error route?

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
