import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

const DATA = [
  { date: new Date('2020-08-01'), value: 90 },
  { date: new Date('2020-08-02'), value: 100 },
  { date: new Date('2020-08-03'), value: 70 },
  { date: new Date('2020-08-04'), value: 65 },
  { date: new Date('2020-08-05'), value: 120 },
];

@Component({
  selector: 'app-d3-chart',
  templateUrl: './d3-chart.component.html',
  styleUrls: ['./d3-chart.component.scss']
})
export class D3ChartComponent implements OnInit {

  @ViewChild('svgContainer') svgContainer: ElementRef;
  // private svg: d3.Selection<SVGSVGElement, any, null, undefined>;

  // pasted from: https://github.com/datencia/d3js-angular-examples/tree/master/src/app/01_line_chart
  private svg: any;
  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private width = 400;
  private height = 300;
  private x: any;
  private y: any;
  private line: d3Shape.Line<[number, number]>;

  constructor() { }

  ngOnInit() {
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawLine();
  }

  private initSvg() {
    this.svg = d3.select(this.svgContainer.nativeElement)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis() {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(DATA, (d) => d.date));
    this.y.domain(d3Array.extent(DATA, (d) => d.value));
  }

  private drawAxis() {

    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Price ($)');
  }

  private drawLine() {
    this.line = d3Shape.line()
      .x((d: any) => this.x(d.date))
      .y((d: any) => this.y(d.value));

    this.svg.append('path')
      .datum(DATA)
      .attr('class', 'line')
      .attr('d', this.line);
  }

}
