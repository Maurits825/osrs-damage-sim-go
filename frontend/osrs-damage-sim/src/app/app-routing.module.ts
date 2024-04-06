import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DpsCalcComponent } from './core/dps-calc/dps-calc.component';

const routes: Routes = [
  { path: 'dps-calc', component: DpsCalcComponent },
  { path: '', redirectTo: '/dps-calc', pathMatch: 'full' },
  { path: '**', redirectTo: '/dps-calc', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
