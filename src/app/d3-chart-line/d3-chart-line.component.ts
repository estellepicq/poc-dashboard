import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

interface DateValue {
  date: Date;
  value: number;
}

const DATA: DateValue[] = [
  { date: new Date('2020-08-01'), value: 90 },
  { date: new Date('2020-08-02'), value: 100 },
  { date: new Date('2020-08-03'), value: 70 },
  { date: new Date('2020-08-04'), value: 65 },
  { date: new Date('2020-08-05'), value: 120 },
];

@Component({
  selector: 'app-d3-chart-line',
  templateUrl: './d3-chart-line.component.html',
  styleUrls: ['./d3-chart-line.component.scss']
})
export class D3ChartLineComponent implements OnInit {

  @ViewChild('svgContainer', { static: true }) svgContainer: ElementRef;

  private svg: d3.Selection<SVGGElement, DateValue, HTMLElement, undefined>;
  private margin = 50;
  private width = 400;
  private height = 300;
  private x: d3Scale.ScaleTime<number, number>;
  private y: d3Scale.ScaleLinear<number, number>;
  private line: d3Shape.Line<DateValue>;

  constructor() { }

  ngOnInit() {
    this.drawSvg();
    this.initAxes();
    this.drawAxes();
    this.drawData();
  }

  private drawSvg() {
    this.svg = d3.select<SVGGElement, DateValue>(this.svgContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private initAxes() {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.x.domain(d3Array.extent(DATA, (d) => d.date));
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.y.domain(d3Array.extent(DATA, (d) => d.value));
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
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Value');
  }

  private drawData() {
    this.line = d3Shape.line<DateValue>()
      .x((d: DateValue) => this.x(d.date))
      .y((d: DateValue) => this.y(d.value));

    this.svg.append('path')
      .datum(DATA)
      .attr('class', 'line')
      .attr('d', this.line);
  }

}
