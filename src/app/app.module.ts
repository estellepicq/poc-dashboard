import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { D3ChartComponent } from './d3-chart/d3-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    D3ChartComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
