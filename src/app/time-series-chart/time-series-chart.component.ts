import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

export interface D3TimeSeries {
  data: TimeDataPoint[];
  color: string;
  type: 'line' | 'curve' | 'bar';
  name: string;
  strokeWidth?: number;
}

interface TimeDataPoint {
  date: number;
  value: number;
}

@Component({
  selector: 'app-time-series-chart',
  templateUrl: './time-series-chart.component.html',
  styleUrls: ['./time-series-chart.component.scss']
})
export class TimeSeriesChartComponent implements OnInit {

  @Input() series: D3TimeSeries[];

  @ViewChild('svgContainer', { static: true }) svgContainer: ElementRef;

  private svg: d3.Selection<SVGGElement, TimeDataPoint, HTMLElement, undefined>;
  private margin = 50;
  private width = 400;
  private height = 300;
  private x: d3Scale.ScaleTime<number, number>;
  private y: d3Scale.ScaleLinear<number, number>;

  constructor() { }

  ngOnInit() {
    this.drawSvg();
    this.initAxes();
    this.drawAxes();
    this.drawData();
  }

  private drawSvg() {
    this.svg = d3.select<SVGGElement, TimeDataPoint>(this.svgContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private initAxes() {
    const dataPoints = this.series.map(serie => serie.data).reduce((acc, curr) => acc.concat(curr), []);
    const dates: number[] = dataPoints.map(dataPoint => dataPoint.date);
    const values: number[] = dataPoints.map(dataPoint => dataPoint.value).concat(0);
    this.x = d3Scale.scaleUtc()
      .range([0, this.width])
      .domain(d3Array.extent(dates));

    this.y = d3Scale.scaleLinear()
      .range([this.height, 0])
      .domain(d3Array.extent(values));
  }

  private drawAxes() {
    // X Axis
    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));
    // Y axis
    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('class', 'axis-title')
      .attr('y', -15)
      .style('text-anchor', 'end')
      .text('Value');
  }

  private drawData() {
    this.series.forEach(serie => {
      const data = serie.data;

      switch (serie.type) {
        // Bars
        case 'bar': {
          this.svg.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => this.x(d.date) )
            .attr('y', (d) => this.y(d.value) )
            .attr('width', 30)
            .attr('height', (d) => this.height - this.y(d.value) );
          break;
        }

        // Lines and curves
        case 'line':
        case 'curve':
        default: {
          const line: d3Shape.Line<TimeDataPoint> = d3Shape.line<TimeDataPoint>()
            .x((d: TimeDataPoint) => this.x(d.date))
            .y((d: TimeDataPoint) => this.y(d.value));

          if (serie.type === 'curve') {
            line.curve(d3Shape.curveCatmullRom.alpha(0.5));
          }

          this.svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('style', `stroke: ${serie.color}; stroke-width: ${serie.strokeWidth || 1}px`)
            .attr('d', line);

          break;
        }
      }

    });
  }

}