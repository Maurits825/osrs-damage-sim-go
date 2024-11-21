import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dps-calc', loadChildren: () => import('./features/dps-calc/dps-calc.module').then((m) => m.DpsCalcModule) },
  { path: 'bis-calc', loadChildren: () => import('./features/bis-calc/bis-calc.module').then((m) => m.BisCalcModule) },
  { path: 'simple-dmg-sim', loadChildren: () => import('./features/simple-dmg-sim/simple-dmg-sim.module').then(m => m.SimpleDmgSimModule) },
  { path: '**', redirectTo: '/dps-calc', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
