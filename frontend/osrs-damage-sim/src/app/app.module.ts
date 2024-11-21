import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ClipboardModule } from 'ngx-clipboard';
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
  bootstrap: [AppComponent],
})
export class AppModule {}
