import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { Friend } from '../friends.model';

@Component({
  selector: 'app-scatter',
  template: `<section><h2>Scatter Plot</h2><figure id="scatter"></figure></section>`
})
export class ScatterComponent implements OnInit, OnChanges {

  @Input() data: Friend[] | null = [];

  private svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private margin = 60;
  private width = 640 - (this.margin * 2);
  private height = 320 - (this.margin * 2);
  private scaleBuffer = 4;

  constructor() { this.svg = d3.select('figure#scatter'); }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && changes.data.currentValue) {
      this.initializeSVG();
      this.drawPlot();
    }
  }

  private initializeSVG() {
    this.svg = d3.select("figure#scatter")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawPlot() {
    if (!this.data) { return; }

    // X axis - Age
    const xData = this.data.map(d => d.age).sort();
    const x = d3.scaleLinear()
      .domain([xData[0] - this.scaleBuffer, xData.slice(-1)[0]])
      .range([0, this.width]);
    this.svg.append("g").attr('class', 'xAxis')
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Y axis - Weight
    const yData = this.data.map(d => d.weight).sort();
    const y = d3.scaleLinear()
      .domain([yData[0] - this.scaleBuffer, yData.slice(-1)[0]])
      .range([this.height, 0]);
    this.svg.append("g").attr('class', 'yAxis')
      .call(d3.axisLeft(y));

    // Dots (x,y)
    const dots = this.svg.append('g').attr('class', 'dots');
    dots.selectAll("dot")
      .data(this.data, data => (data as any).name)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.age))
      .attr("cy", d => y(d.weight))
      .attr("r", 7)
      .style("opacity", .5)
      .style("fill", "#673ab7");

    // Labels - Name
    dots.selectAll("text")
      .data(this.data, data => (data as any).name)
      .enter()
      .append("text")
      .text(d => d.name)
      .attr("x", d => x(d.age))
      .attr("y", d => y(d.weight))
  }

}
