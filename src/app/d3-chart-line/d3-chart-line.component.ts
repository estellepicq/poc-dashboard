import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

export interface D3Serie {
  data: DataPoint[];
  color: string;
  strokeWidth: number;
  type: string;
  name: string;
}

interface DataPoint {
  date: number;
  value: number;
}

@Component({
  selector: 'app-d3-chart-line',
  templateUrl: './d3-chart-line.component.html',
  styleUrls: ['./d3-chart-line.component.scss']
})
export class D3ChartLineComponent implements OnInit {

  @Input() series: D3Serie[];

  @ViewChild('svgContainer', { static: true }) svgContainer: ElementRef;

  private svg: d3.Selection<SVGGElement, DataPoint, HTMLElement, undefined>;
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
    this.svg = d3.select<SVGGElement, DataPoint>(this.svgContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private initAxes() {
    const dataPoints = this.series.map(serie => serie.data).reduce((acc, curr) => acc.concat(curr), []);
    const dates: number[] = dataPoints.map(dataPoint => dataPoint.date);
    this.x = d3Scale.scaleUtc().range([0, this.width]);
    this.x.domain(d3Array.extent(dates));

    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.y.domain(d3Array.extent(dataPoints, (d) => d.value));
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
      // .attr('transform', 'rotate(-90)')
      // .attr('y', -30)
      // .attr('dy', '0')
      .style('text-anchor', 'end')
      .text('Value');
  }

  private drawData() {
    this.series.forEach(serie => {
      const data = serie.data;
      const line: d3Shape.Line<DataPoint> = d3Shape.line<DataPoint>()
        .x((d: DataPoint) => this.x(d.date))
        .y((d: DataPoint) => this.y(d.value));

      this.svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('style', `stroke: ${serie.color}; stroke-width: ${serie.strokeWidth || 1}px`)
        .attr('d', line);
    });
  }

}
