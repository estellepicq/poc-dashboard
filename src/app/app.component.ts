import { Component } from '@angular/core';
import { D3TimeSerie } from './time-series-chart/time-series-chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public timeSeries: D3TimeSerie[] = [
    {
      name: 'toto',
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
      name: 'tutu',
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
      name: 'tata',
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
      name: 'tétété',
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

}
