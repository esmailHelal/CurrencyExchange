import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsPage } from './page/details/details.page';
import { StickyPanelModule } from '../home/components/sticky-panel/sticky-panel.module';
import { CompareDateChartComponent } from './components/compare-date-line-chart/compare-date-line-chart.component';


@NgModule({
  declarations: [
    DetailsPage,
    CompareDateChartComponent
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    StickyPanelModule,
    
  ],
  providers: [DatePipe, DecimalPipe],
})
export class DetailsModule { }
