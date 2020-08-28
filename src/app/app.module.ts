import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { D3ChartLineComponent } from './d3-chart-line/d3-chart-line.component';
import { D3ChartBarComponent } from './d3-chart-bar/d3-chart-bar.component';
import { D3ChartPieComponent } from './d3-chart-pie/d3-chart-pie.component';

@NgModule({
  declarations: [
    AppComponent,
    D3ChartLineComponent,
    D3ChartBarComponent,
    D3ChartPieComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
