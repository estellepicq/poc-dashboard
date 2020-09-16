import { Component } from '@angular/core';
import { D3Serie } from './d3-chart-line/d3-chart-line.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'poc-dashboard';

  public lineSeries: D3Serie[] = [
    {
      name: 'toto',
      color: '#000',
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
      color: '#ccc',
      type: 'line',
      strokeWidth: 1.5,
      data: [
        { date: 1599766853000, value: 120 },
        { date: 1599853253000, value: 50 },
        { date: 1599939653000, value: 30 },
        { date: 1600026053000, value: 25 },
        { date: 1600112453000, value: 10 },
      ]
    }
  ];

}
