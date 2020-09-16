import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

interface PopulationData {
  age: string;
  population: number;
}

const POPULATION: PopulationData[] = [
  {age: '<5', population: 2704659},
  {age: '5-13', population: 4499890},
  {age: '14-17', population: 2159981},
  {age: '18-24', population: 3853788},
  {age: '25-44', population: 14106543},
  {age: '45-64', population: 8819342},
  {age: '≥65', population: 612463}
];

@Component({
  selector: 'app-d3-chart-pie',
  templateUrl: './d3-chart-pie.component.html',
  styleUrls: ['./d3-chart-pie.component.scss']
})
export class D3ChartPieComponent implements OnInit {
  @ViewChild('svgContainer', { static: true }) svgContainer: ElementRef;

  private svg: d3.Selection<SVGGElement, PopulationData, HTMLElement, undefined>;
  private margin = 50;
  private width = 400;
  private height = 300;
  private arc: any;
  private labelArc: any;
  private pie: any;
  private color: any;
  private radius: number = Math.min(this.width, this.height) / 2;

  constructor() { }

  ngOnInit() {
    this.initSvg();
    this.drawPie();
  }

  private initSvg() {
    this.svg = d3.select<SVGGElement, PopulationData>(this.svgContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
  }

  private drawPie() {
    this.color = d3Scale.scaleOrdinal()
      .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

    this.arc = d3Shape.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(0);

    this.labelArc = d3Shape.arc()
      .outerRadius(this.radius - 40)
      .innerRadius(this.radius - 40);

    this.pie = d3Shape.pie()
      .sort(null)
      .value((d: any) => d.population);

    const g = this.svg.selectAll('.arc')
      .data(this.pie(POPULATION))
      .enter().append('g')
      .attr('class', 'arc');
    g.append('path').attr('d', this.arc)
      .style('fill', (d: any) => this.color(d.data.age));
    g.append('text').attr('transform', (d: any) => 'translate(' + this.labelArc.centroid(d) + ')')
      .attr('dy', '.35em')
      .text((d: any) => d.data.age);
  }
}
