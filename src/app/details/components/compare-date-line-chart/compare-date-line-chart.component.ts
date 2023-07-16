import * as d3 from 'd3';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


import { DatePipe } from '@angular/common';
import { Point } from '@angular/cdk/drag-drop';
import { CompareDateResponse } from '../../models/compare-date-response.model';
import { CompareDateTooltip } from '../../models/compare-date-tooltip.model';

import { maxBy } from 'lodash-es';
import { BreakpointService } from 'src/app/shared/core/breakpoint/breakpoint.service';

@UntilDestroy()
@Component({
  selector: 'ga-compare-date-line-chart',
  templateUrl: './compare-date-line-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompareDateChartComponent {
  firstPeriod?: string;

  @Input() set compareMonth(compareMonthData: CompareDateResponse) {
    console.log(compareMonthData);

    if (compareMonthData && compareMonthData.firstPeriodData.length > 0) {
      this.compareMonthData = compareMonthData;
      this.firstPeriod = `${
        this.compareMonthData?.firstPeriodData[0].xLabel
      } - ${
        this.compareMonthData?.firstPeriodData[
          this.compareMonthData.firstPeriodData.length - 1
        ].xLabel
      }`;

      this.initScales();
    }
  }

  @Input() isLoadingCompareMoth!: boolean;
  compareMonthData!: CompareDateResponse;

  xScale!: d3.ScaleLinear<number, number>;
  yScale!: d3.ScaleLinear<number, number>;
  xAxisValues: Array<string> = [];
  xAllAxisValues: Array<string> = [];
  yAxisValues: Array<number> = [];

  get xTitleTransform(): string {
    const xOffset = 130;
    const yOffset = 45;

    return `translate(${xOffset}, ${yOffset})`;
  }

  get yTitleTransform(): string {
    const xOffset = -40;
    const yOffset =
      this.height - (this.isSmWidth || this.isMdWidth ? 110 : 140);

    return `translate(${xOffset}, ${yOffset}) rotate(-90)`;
  }

  get transformTranslateX(): string {
    return `translate(0,${this.height - this.marginBottom})`;
  }

  get transformTranslateY(): string {
    if (this.isSmWidth || this.isMdWidth) {
      return `translate(${this.marginLeftSm},0)`;
    }

    return `translate(${this.marginLeftLg},0)`;
  }

  get height(): number {
    if (this.isSmWidth || this.isMdWidth) {
      return 400;
    }

    return 230;
  }

  get fontSize(): string {
    if (this.isSmWidth || this.isMdWidth) {
      return '1em';
    }

    return '0.65em';
  }

  get labelFontSize(): string {
    if (this.isSmWidth || this.isMdWidth) {
      return '1.3em';
    }

    return '0.8em';
  }

  get toolTipFontSize(): string {
    if (this.isSmWidth || this.isMdWidth) {
      return '1.1em';
    }

    return '0.6em';
  }

  get tooltipWidth(): number {
    if (this.isSmWidth || this.isMdWidth) {
      return 270;
    }

    return 180;
  }

  get tooltipHeight(): number {
    if (this.isSmWidth || this.isMdWidth) {
      return 60;
    }

    return 30;
  }

  get tooltipLabelPadding(): number {
    if (this.isSmWidth || this.isMdWidth) {
      return 6.6;
    }

    return 5.7;
  }

  salesTrendCharts = ['first'];
  isSmWidth = false;
  isMdWidth = false;
  marginTop = 20;
  marginRight = 40;
  marginBottom = 60;
  marginLeftLg = 70;
  marginLeftSm = 60;
  width = 640;
  widthLg = 900;

  mouseXPosition!: number;
  tooltip: CompareDateTooltip | any = null;

  isTooltipVisible = false;

  constructor(
    private readonly breakpointService: BreakpointService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly datePipe: DatePipe
  ) {
    this.initBreakpointHandler();
  }

  transformTranslateXValues(xValue: string, index: number): string {
    if (this.xAxisValues.length === 1) {
      return `translate(${this.marginLeftLg},0)`;
    }

    const max = this.xAllAxisValues
      .map(Number)
      .reduce((a, b) => Math.max(a, b));
    if (
      Number(this.xAllAxisValues[this.xAllAxisValues.length - 1]) < max &&
      this.xAxisValues.length - 1 === index
    ) {
      return `translate(${this.xScale(this.xAllAxisValues.length - 1)},0)`;
    }

    return `translate(${this.xScale(this.xAllAxisValues.indexOf(xValue))},0)`;
  }

  transfromTranslateYValues(data: number): string {
    return `translate(0,${this.yScale(data)})`;
  }

  yAxisLabels(): number {
    return -9;
  }

  getX(): number {
    return this.isSmWidth || this.isMdWidth
      ? 530
      : this.widthLg - this.marginRight - this.marginLeftLg;
  }

  getY(): number {
    return this.marginBottom + this.marginTop - this.height;
  }

  getViewBox(): string {
    if (this.isSmWidth || this.isMdWidth) {
      return `0,0,${this.width},${this.height}`;
    }

    return `0,0,${this.widthLg},${this.height}`;
  }

  getWidth(): number {
    if (this.isSmWidth || this.isMdWidth) {
      return this.width - this.marginRight - this.marginLeftSm;
    }

    return this.widthLg - this.marginRight - this.marginLeftLg;
  }

  setXAxisAndScale(): void {
    let xRange;

    const longerPeriodData = this.compareMonthData?.firstPeriodData;

    this.xAllAxisValues = d3.map(longerPeriodData, (point: any) => point.x);

    if (this.isSmWidth || this.isMdWidth) {
      xRange = [this.marginLeftLg, this.width - this.marginRight];
    } else {
      xRange = [this.marginLeftLg, this.widthLg - this.marginRight];
    }

    if (this.xAllAxisValues.length <= 12) {
      this.xAxisValues = this.xAllAxisValues;
    } else {
      this.xAxisValues = this.xAllAxisValues.filter(
        (value, index) => index % 3 === 0
      );

      if (
        this.xAxisValues[this.xAxisValues.length - 1] !==
        this.xAllAxisValues[this.xAllAxisValues.length - 1]
      ) {
        this.xAxisValues.push(
          this.xAllAxisValues[this.xAllAxisValues.length - 1]
        );
      }
    }

    this.xScale = d3
      .scaleLinear()
      .domain([0, this.xAllAxisValues.length - 1])
      .range(xRange);
  }

  setYAxisAndScale(): void {
    const maxY = this.findMaxY();

    const yAxisStart =
      maxY === 0 ? this.height - this.marginBottom : this.marginTop;
    const yRange = [this.height - this.marginBottom, yAxisStart];

    const interval = maxY / 4;

    this.yAxisValues = [];

    for (let i = 0; i <= 4; i++) {
      this.yAxisValues.push(interval * i);
    }

    this.yScale = d3.scaleLinear().domain([0, maxY]).range(yRange);
  }

  private initScales(): void {
    if (this.compareMonthData) {
      this.setXAxisAndScale();
      this.setYAxisAndScale();
    }

    this.mouseXPosition = 0;
    this.tooltip = null;
    this.isTooltipVisible = false;
  }

  private initBreakpointHandler(): void {
    this.breakpointService.smWidth$
      .pipe(untilDestroyed(this))
      .subscribe((isSmWidth: boolean) => {
        if (this.isSmWidth !== isSmWidth) {
          this.isSmWidth = isSmWidth;
          this.isMdWidth = false;
          this.initScales();
          this.changeDetector.markForCheck();
        }
      });

    this.breakpointService.isTablet$
      .pipe(untilDestroyed(this))
      .subscribe((isTablet: boolean) => {
        if (this.isMdWidth !== isTablet) {
          this.isMdWidth = isTablet;
          this.isSmWidth = false;
          this.initScales();
          this.changeDetector.markForCheck();
        }
      });
  }

  findMaxY(): number {
    const firstPeriodMaxY =
      maxBy(this.compareMonthData?.firstPeriodData, 'y')?.y || 0;

    return firstPeriodMaxY;
  }

  getColor(salesTrendChart: string): string {
    return salesTrendChart === 'first' ? '#FF824C' : '#3399FF';
  }

  getPath(salesTrendChart: string): any {
    const salesTrend = this.compareMonthData?.firstPeriodData;
    const yDatas = salesTrend.map((st) => st.y);
    const indexArray = d3.range(yDatas.length);

    const line = d3
      .line()
      .x((index: any) => this.xScale(index))
      .y((index: any) => this.yScale(yDatas[index]));

    return line(indexArray as any);
  }

  mouseout(): void {
    this.isTooltipVisible = false;
  }

  mouseover(): void {
    this.isTooltipVisible = true;
  }

  transformCircle(data: number): string | undefined {
    return `translate(${this.marginLeftLg},${this.yScale(data)})`;
  }

  transformMousePerLine(period?: string): string | undefined {
    if (this.mouseXPosition) {
      if (!period) {
        return `translate(${this.mouseXPosition},${
          this.yScale(this.findMaxY()) - 10
        })`;
      }

      if (period === 'arrow') {
        return `translate(${this.mouseXPosition},${this.yScale(
          this.findMaxY()
        )})`;
      }

      const elements = document.getElementsByClassName('line');

      const element = period === 'first' ? elements[0] : elements[1];
      const position = this.getPosition(element as SVGPathElement);

      return `translate(${this.mouseXPosition},${position.y})`;
    } else {
      return undefined;
    }
  }

  getPosition(previousElement: SVGPathElement): Point {
    let pos = { x: 0, y: 0 };

    if (previousElement instanceof SVGPathElement && this.compareMonthData) {
      pos = this.getStartEndPositions(previousElement);
    }

    return pos;
  }

  getStartEndPositions(previousElement: SVGPathElement): Point {
    let pos = { x: 0, y: 0 };
    let target = null;
    let beginning = 0;
    let end = previousElement.getTotalLength();

    while (true) {
      target = Math.floor((beginning + end) / 2);

      pos = previousElement.getPointAtLength(target);
      if (
        (target === end || target === beginning) &&
        pos.x !== this.mouseXPosition
      ) {
        break;
      }

      if (pos.x > this.mouseXPosition) {
        end = target;
      } else if (pos.x < this.mouseXPosition) {
        beginning = target;
      } else {
        break;
      }
    }

    return pos;
  }

  tooltipTransform(xPos: number, yPos: number): string {
    if (this.isSmWidth || this.isMdWidth) {
      xPos = 1.5 * xPos;
      yPos = 2 * yPos;
    }

    let width = this.widthLg;

    if (this.isSmWidth || this.isMdWidth) width = this.width;

    const xPosition =
      this.mouseXPosition > width - this.tooltipWidth / 2
        ? xPos - this.tooltipWidth + width - this.mouseXPosition
        : xPos - this.tooltipWidth / 2;
    const yPosition = yPos;

    return `translate(${xPosition} , ${yPosition})`;
  }

  mousemove(event: MouseEvent | TouchEvent): void {
    if (event instanceof TouchEvent) {
      this.mouseXPosition = d3.pointer(event.touches[0])[0];
    } else {
      this.mouseXPosition = d3.pointer(event)[0];
    }
    this.setTooltip(event);
  }

  setTooltip(event: MouseEvent | TouchEvent): void {
    let index!: number;
    if (event instanceof TouchEvent) {
      index = this.xScale.invert(d3.pointer(event.touches[0])[0]);
    } else {
      index = this.xScale.invert(d3.pointer(event)[0]);
    }

    const firstPeriodData =
      this.compareMonthData?.firstPeriodData[Math.round(index)];

    this.tooltip = {
      firstPeriodDate: firstPeriodData?.xLabel,
      firstPeriodSales: firstPeriodData?.y,
    };
  }

  lineMovement(): Array<string | number> | undefined {
    if (this.mouseXPosition) {
      return [
        `M${this.mouseXPosition}`,
        this.height - this.marginBottom,
        this.mouseXPosition,
        this.marginTop,
      ];
    } else {
      return undefined;
    }
  }

  dateToString(date: Date | null): string | null {
    if (!date) {
      return null;
    }

    return this.datePipe.transform(date, 'dd/MM/yy');
  }
}
