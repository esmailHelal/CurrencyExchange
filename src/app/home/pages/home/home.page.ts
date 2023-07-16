import { Component, OnInit } from '@angular/core';
import { join } from 'lodash-es';

import { DataMostPopular } from '../../models/symbols';
import { ApiService } from 'src/app/shared/core/backend-services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',

})
export class HomePage  {
  symbols:Array<string>=[
    'USD',
    'JPY',
    'GBP',
    'AUD',
    'CAD',
    'CHF',
    'HKD',
    'NZD'
  ];
  get symbolsrequest(): string {
    return join(this.symbols,',');
  }
  arrayMostPopular:Array<DataMostPopular>=[];
  constructor( private ApiService: ApiService,) { 
    this.ApiService.getMostPopular(this.symbolsrequest).pipe(untilDestroyed(this)).subscribe(data=>{
      
      this.symbols.forEach(element => {
        this.arrayMostPopular.push({to:element,rate:data.rates[element]})
      });
    })

  }

  

}
