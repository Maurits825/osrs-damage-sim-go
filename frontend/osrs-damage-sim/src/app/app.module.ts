import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ClipboardModule } from 'ngx-clipboard';
import { GEAR_SETUP_TOKEN, INPUT_GEAR_SETUP_TOKEN } from './model/shared/injection-token.const';
import { AppRoutingModule } from './app-routing.module';
import { DpsCalcModule } from './features/dps-calc/dps-calc.module';
import { LayoutModule } from './features/layout/layout.module';
@NgModule({
  declarations: [AppComponent],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    ClipboardModule,
    AppRoutingModule,
    DpsCalcModule,
    LayoutModule,
  ],
  //TODO move somewhere else???
  providers: [
    { provide: INPUT_GEAR_SETUP_TOKEN, useValue: null },
    { provide: GEAR_SETUP_TOKEN, useValue: null },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
