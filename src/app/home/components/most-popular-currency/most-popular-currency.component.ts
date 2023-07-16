import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-most-popular-currency',
  templateUrl: './most-popular-currency.component.html',
 
})
export class MostPopularCurrencyComponent implements OnInit {
  @Input() valueFrom:string="EUR";
  @Input() valueTo:string="USD";
  @Input() defaultValueTo:number=1.00;
  constructor() { }

  ngOnInit(): void {
  }

}
