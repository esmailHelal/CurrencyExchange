import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StickyPanelComponent } from 'src/app/home/components/sticky-panel/sticky-panel.component';

import { CompareDateResponse } from '../../models/compare-date-response.model';
import { CompareDatePoint } from '../../models/compare-date-point.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiService } from 'src/app/shared/core/backend-services/api.service';
@UntilDestroy()
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
})
export class DetailsPage {
  selectedValueFrom: string = 'EUR';
  selectedValueTo: string = 'USD';
  amountValue: number = 1;
  totalResult: number = 0.0;
  hidden: boolean = true;
  @ViewChild('StickyPanelComponent')
  stickyPanelComponent!: StickyPanelComponent;
  arrayMonth = [
    {
      month: 'Jan',
      date: '2022-01-01',
    },
    {
      month: 'Fab',
      date: '2022-02-01',
    },
    {
      month: 'Mar',
      date: '2022-03-01',
    },
    {
      month: 'Apr',
      date: '2022-04-01',
    },
    {
      month: 'May',
      date: '2022-05-01',
    },
    {
      month: 'Jun',
      date: '2022-06-01',
    },
    {
      month: 'Jul',
      date: '2022-07-01',
    },
    {
      month: 'Aug',
      date: '2022-08-01',
    },
    {
      month: 'Sep',
      date: '2022-09-01',
    },
    {
      month: 'Oct',
      date: '2022-10-01',
    },
    {
      month: 'Nov',
      date: '2022-11-01',
    },
    {
      month: 'Dec',
      date: '2022-12-01',
    },
  ];
  compareDateChart!: CompareDateResponse;
  compareDatePoint: Array<CompareDatePoint> = [];
  symbol!:string;
  isLoadingCompareMoth:boolean=true;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private ApiService: ApiService,
    private readonly router: Router
  ) {
    this.getQueryParams();
    this.initChart(true);
    this.ApiService.getSymbolsList().pipe(untilDestroyed(this)).subscribe(data=>{
      this.symbol = data.symbols[this.selectedValueFrom];
    });
  }

  initChart(first: boolean = false) {
    this.compareDatePoint = [];
    this.compareDateChart = {
      firstPeriodData: [],
    };
    this.arrayMonth.forEach((element, index) => {
      this.isLoadingCompareMoth=true;
      this.ApiService.getHistroic(
        first
          ? this.selectedValueFrom
          : this.stickyPanelComponent.selectedValueFrom,
        first
          ? this.selectedValueTo
          : this.stickyPanelComponent.selectedValueTo,
        element.date
      ).pipe(untilDestroyed(this)).subscribe((data) => {
        if (data.success) {
          this.compareDatePoint.push({
            x: element.month,
            xLabel: element.month,
            y: data.rates[this.stickyPanelComponent.selectedValueTo],
          });
         
          if (this.arrayMonth.length - 1 === index) {
            this.compareDateChart = {
              firstPeriodData: this.compareDatePoint,
            };
            this.isLoadingCompareMoth=false;
          }
        }else{
          this.isLoadingCompareMoth=false;
        }
      });
    });
  }

  getQueryParams() {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      if (params['from']) {
        this.selectedValueFrom = params['from'];
      }
      if (params['to']) {
        this.selectedValueTo = params['to'];
      }
      if (params['amountValue']) {
        this.amountValue = params['amountValue'];
      }
      if (params['totalResult']) {
        this.totalResult = params['totalResult'];
      }

      this.stickyPanelComponent?.getRate(
        this.selectedValueFrom,
        this.selectedValueTo
      );
    });
  }
  goToHome(){
    this.router.navigate(['/home']);
  }
}
