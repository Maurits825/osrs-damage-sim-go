import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GearSetupComponent } from './gear-setup/gear-setup.component';

@NgModule({
  declarations: [
    AppComponent,
    GearSetupComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent, GearSetupComponent]
})
export class AppModule { }
