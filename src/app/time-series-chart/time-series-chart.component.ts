import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3TimeFormat from 'd3-time-format';
import * as d3Time from 'd3-time';
import { formatDate } from '@angular/common';

export interface ChartOptions {
  width: number;
  height: number;
  margin: number;
  title: string;
  yConfig: { title?: string; tickInterval?: number; tickFormat?: string };
  xConfig: { title?: string; tickInterval?: number; tickFormat?: string };
}

export interface D3TimeSerie {
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
  
  @Input() series: D3TimeSerie[];
  @Input() options: Partial<ChartOptions>;
  
  @ViewChild('svgContainer', { static: true }) svgContainer: ElementRef;
  
  private svg: d3.Selection<SVGGElement, TimeDataPoint, HTMLElement, undefined>;
  private x: d3Scale.ScaleTime<number, number>;
  private y: d3Scale.ScaleLinear<number, number>;
  private mousePerLine: d3.Selection<SVGGElement, D3TimeSerie, SVGGElement, TimeDataPoint>;
  private mouseG: d3.Selection<SVGGElement, TimeDataPoint, HTMLElement, undefined>;
  private tooltip: d3.Selection<HTMLElement, TimeDataPoint, HTMLElement, undefined>;

  constructor() { }
  
  ngOnInit() {
    this.drawSvg();
    this.initAxes();
    this.drawAxes();
    this.drawData();
    this.drawTooltip();
    this.drawLegend();
  }
  
  private drawSvg() {
    this.svg = d3.select<SVGGElement, TimeDataPoint>(this.svgContainer.nativeElement)
    .append('svg')
    .attr('width', this.options.width + this.options.margin * 2)
    .attr('height', this.options.height + this.options.margin * 2)
    .append('g')
    .attr('transform', 'translate(' + this.options.margin + ',' + this.options.margin + ')');

    // Add optional title
    if (this.options.title) {
      this.svg.append('text')
        .attr('x', (this.options.width / 2))             
        .attr('y', 0 - (this.options.margin / 2))
        .attr('text-anchor', 'middle')  
        .style('font-size', '16px') 
        .style('text-decoration', 'underline')  
        .text(this.options.title);
    }
  }
  
  private initAxes() {
    const dataPoints = this.series.map(serie => serie.data).reduce((acc, curr) => acc.concat(curr), []);
  
    this.x = d3Scale.scaleUtc()
    .range([0, this.options.width])
    .domain(d3Array.extent(dataPoints, d => d.date));
    
    this.y = d3Scale.scaleLinear()
    .range([this.options.height, 0])
    .domain([0, d3Array.max(dataPoints, d => d.value)]);
  }
  
  private drawAxes() {
    // X Axis
    this.svg.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + this.options.height + ')')
    .call(
      d3Axis.axisBottom(this.x)
        .tickFormat(d3TimeFormat.timeFormat(this.options.xConfig?.tickFormat ?? '%b-%d'))
        .ticks(d3Time.timeDay.every(1))
    );
    // Y axis
    this.svg.append('g')
    .attr('class', 'axis axis--y')
    .call(d3Axis.axisLeft(this.y))
    .append('text')
    .attr('y', -15)
    .style('text-anchor', 'end')
    .style('stroke', '#000')
    .style('stroke-width', '0.6px')
    .style('fill', 'none')
    .style('font', '10px sans-serif')
    .text(this.options.yConfig?.title ?? '');
  }

  private drawTooltip() {
    this.mouseG = this.svg.append('g')
      .attr('class', 'mouse-over-effects');

    this.mouseG.append('path') // create vertical line to follow mouse
    .attr('class', 'mouse-line')
    .attr('stroke', '#A9A9A9')
    .attr('stroke-width', '1px')
    .attr('opacity', '0');

    this.mousePerLine = this.mouseG.selectAll('.mouse-per-line')
      .data(this.series)
      .enter()
      .append('g')
      .attr('class', 'mouse-per-line');

    this.mousePerLine.append('circle')
      .attr('r', 4)
      .style('stroke', (d) => d.color)
      .style('fill', 'none')
      .style('stroke-width', '1px')
      .style('opacity', '0');
      
    // Create the tooltip
    this.tooltip = d3.select<SVGGElement, TimeDataPoint>(this.svgContainer.nativeElement)
      .append('div')
      .attr('id', 'tooltip')
      .style('position', 'absolute')
      .style('left', '0')
      .style('top', '0')
      .style('background-color', '#eee')
      .style('padding', '5px')
      .style('font-size', '12px')
      .style('display', 'none');
      
    // Append a rect over svg area to detect mouse events
    this.mouseG.append('rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', this.options.width)
      .attr('height', this.options.height)
      .on('mouseover', this.mouseover)
      .on('mousemove', this.mousemove.bind(this))
      .on('mouseout', this.mouseout);
  
  }
  
  private drawData(): void {
    const barSeries = this.series.filter(serie => serie.type === 'bar');
    const lineSeries = this.series.filter(serie => serie.type === 'line' || serie.type === 'curve');
    this.drawBars(barSeries);
    this.drawLines(lineSeries);
  }
  
  private drawBars(barSeries: D3TimeSerie[]): void {
    const barWidth = 30 / barSeries.length;
    this.svg.append('g')
    .selectAll('g')
    .data(barSeries)
    .join('g')
    .attr('fill', (s) => s.color)
    .style('transform', (s, i) => `translate(${i * barWidth}px,0px)`)
    .selectAll('rect')
    // map to data
    .data(d => d.data)
    .join('rect')
    .attr('x', (d)=> this.x(d.date))
    .attr('y', d => this.y(d.value))
    .attr('width', barWidth)
    .attr('height', (d) => this.options.height - this.y(d.value));
  }
  
  private drawLines(lineSeries: D3TimeSerie[]): void {
    lineSeries.forEach(serie => {
      const line: d3Shape.Line<TimeDataPoint> = d3Shape.line<TimeDataPoint>()
      .x((d: TimeDataPoint) => this.x(d.date))
      .y((d: TimeDataPoint) => this.y(d.value));
      
      if (serie.type === 'curve') {
        line.curve(d3Shape.curveCatmullRom.alpha(0.5));
      }
      
    this.svg.append('path')
      .datum(serie.data)
      .attr('class', 'line')
      .attr('stroke', serie.color)
      .attr('stroke-width', `${serie.strokeWidth}px`)
      .attr('fill', 'none')
      .attr('d', line);
    });
  }
  
  private drawLegend(): void {
    // add legend   
    const legend = this.svg.append('g')
    .attr('class', 'legend')
    .attr('height', 100)
    .attr('width', this.options.width)
    .attr('transform', `translate(${this.options.width / 2 - (this.series.length - 2) * 75},${this.options.height + 30})`);
    
    legend.selectAll('rect')
    .data(this.series)
    .enter()
    .append('rect')
    .attr('x', (d, i) => d.name.length + i * 70)
    .attr('y', 0)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', (d) => d.color);
    
    legend.selectAll('text')
    .data(this.series)
    .enter()
    .append('text')
    .attr('x', (d, i) => d.name.length + i * 70 + 15)
    .attr('y', 10)
    .text((d) => d.name);    
  }

  private mouseover(): void {
    d3.select('.mouse-line').style('opacity', '1');
    d3.selectAll('.mouse-per-line circle').style('opacity', '1');
    d3.selectAll('#tooltip').style('display', 'block');
  }

  private mousemove(): void {
    const mouse = d3.mouse(d3.event.currentTarget);

    d3.selectAll('.mouse-per-line')
      .attr('transform', (serie: D3TimeSerie) =>  {
        const dataPoint = this.getDatapointFromMouse(mouse, serie);

        d3.select('.mouse-line')
          .attr('d', () => 'M' + this.x(dataPoint.date) + ',' + (this.options.height) + ' ' + this.x(dataPoint.date) + ',' + 0);
        return 'translate(' + this.x(dataPoint.date) + ',' + this.y(dataPoint.value) + ')';
      });

    this.updateTooltipContent(mouse);
  }

  private mouseout(): void {
    d3.select('.mouse-line').style('opacity', '0');
    d3.selectAll('.mouse-per-line circle').style('opacity', '0');
    d3.selectAll('.mouse-per-line text').style('opacity', '0');
    d3.selectAll('#tooltip').style('display', 'none');
  }

  private updateTooltipContent(mouse: [number, number]): void {
    const mappedSeries = this.series.map(serie => {
      const dataPoint = this.getDatapointFromMouse(mouse, serie);
      return {
        name: serie.name,
        date: dataPoint.date,
        value: dataPoint.value,
        color: serie.color
      };
    });

    this.tooltip
      .html(formatDate(mappedSeries[0].date, 'yyyy-MM-dd hh:mm', 'fr_FR'))
      .style('display', 'block')
      .style('left', `${d3.event.pageX + 20}px`)
      .style('top', `${d3.event.pageY - 20}px`)
      .selectAll()
      .data(mappedSeries).enter()
      .append('div')
      .style('color', d => d.color)
      .style('font-size', '11px')
      .html(d => `${d.name}: ${d.value}`);
  }

  private getDatapointFromMouse(mouse: [number, number], serie: D3TimeSerie): TimeDataPoint {
    const xDate = this.x.invert(mouse[0]) // use 'invert' to get date corresponding to distance from mouse position relative to svg
    const bisect = d3Array.bisector((d: TimeDataPoint) => d.date).left // retrieve row index of date on parsed csv
    const idx = bisect(serie.data, xDate);
    const dataPoint0 = serie.data[idx - 1];
    const dataPoint1 = serie.data[idx];
    return xDate.getTime() - dataPoint0.date > dataPoint1.date - xDate.getTime() ? dataPoint1 : dataPoint0;
  }
}
