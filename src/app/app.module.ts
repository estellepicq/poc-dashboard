import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { D3ChartBarComponent } from './d3-chart-bar/d3-chart-bar.component';
import { D3ChartPieComponent } from './d3-chart-pie/d3-chart-pie.component';
import { TimeSeriesChartComponent } from './time-series-chart/time-series-chart.component';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    TimeSeriesChartComponent,
    D3ChartBarComponent,
    D3ChartPieComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeFr, 'fr');
  }
}
