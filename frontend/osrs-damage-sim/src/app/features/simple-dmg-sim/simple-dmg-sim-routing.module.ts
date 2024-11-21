import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleDmgSimComponent } from './simple-dmg-sim.component';

const routes: Routes = [{ path: '', component: SimpleDmgSimComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimpleDmgSimRoutingModule { }
