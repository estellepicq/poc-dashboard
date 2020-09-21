import { Component } from '@angular/core';
import { ChartOptions, D3TimeSerie } from './time-series-chart/time-series-chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public timeSeries: D3TimeSerie[] = [
    {
      name: 'Série 1',
      color: 'darkslateblue',
      type: 'line',
      strokeWidth: 1.5,
      data: [
        { date: 1599766853000, value: 90 },
        { date: 1599853253000, value: 100 },
        { date: 1599939653000, value: 70 },
        { date: 1600026053000, value: 65 },
        { date: 1600112453000, value: 120 },
      ]
    },
    {
      name: 'Série 2',
      color: 'coral',
      type: 'line',
      strokeWidth: 1.5,
      data: [
        { date: 1599766853000, value: 120 },
        { date: 1599853253000, value: 50 },
        { date: 1599939653000, value: 30 },
        { date: 1600026053000, value: 25 },
        { date: 1600112453000, value: 10 },
      ]
    },
    {
      name: 'Série 3',
      color: 'steelblue',
      type: 'line',
      data: [
        { date: 1599766853000, value: 10 },
        { date: 1599853253000, value: 20 },
        { date: 1599939653000, value: 30 },
        { date: 1600026053000, value: 50 },
        { date: 1600112453000, value: 40 },
      ]
    },    
    {
      name: 'Série 4',
      color: 'blueviolet',
      type: 'line',
      data: [
        { date: 1599766853000, value: 50 },
        { date: 1599853253000, value: 10 },
        { date: 1599939653000, value: 60 },
        { date: 1600026053000, value: 4 },
        { date: 1600112453000, value: 17 },
      ]
    }
  ];

  public options: Partial<ChartOptions> = {
    title: 'Time series chart',
    height: 300,
    width: 400,
    margin: 50,
    yConfig: { title: 'Values' },
    xConfig: { tickFormat: '%d-%m' }
  };

}
