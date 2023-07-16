import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiService } from 'src/app/shared/core/backend-services/api.service';

@UntilDestroy()
@Component({
  selector: 'app-sticky-panel',
  templateUrl: './sticky-panel.component.html',
  
})
export class StickyPanelComponent implements OnInit {
  symbols!:Array<string>;
  @Input() selectedValueFrom:string="EUR";
  @Input() selectedValueTo:string="USD";
  nameCurrenyFrom:string="EUR";
  nameCurrenyTo:string="USD";
  @Input() amountValue:number=1;
  defaultValueFrom:number=1.00;
  defaultValueTo:number=1.00;
  @Input() totalResult:number=0.00;
  @Input() hidden:boolean=false;
  @Output() readonly currencyChange: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  constructor(private ApiService:ApiService,private readonly router: Router,) { 

  }

 

  ngOnInit(): void {
    this.nameCurrenyFrom=this.selectedValueFrom;
    this.nameCurrenyTo=this.selectedValueTo;
    this.ApiService.getSymbolsList().pipe(untilDestroyed(this)).subscribe(data=>{
      this.symbols = Object.keys(data.symbols);
    });

    this.getRate(this.selectedValueFrom,this.selectedValueTo,true);
  }

  
  getRate(from:string,to:string,first:boolean=false){
    this.ApiService.getRate(from,to).pipe(untilDestroyed(this)).subscribe(data=>{
      if(data.success){
        this.defaultValueTo=data.rates[this.selectedValueTo];
        this.nameCurrenyFrom= this.selectedValueFrom;
        this.nameCurrenyTo=this.selectedValueTo;
        if(!first){
          this.totalResult=0.00;
          this.currencyChange.emit(true);
        } 
      }else{
        this.selectedValueFrom= this.nameCurrenyFrom;
        this.selectedValueTo=this.nameCurrenyTo;
      }
     })
  }
  changeSelectFrom(event:Event){
    this.selectedValueFrom= (event.target as HTMLSelectElement).value;
 
    this.getRate(this.selectedValueFrom,this.selectedValueTo);
  }
  changeSelectTo(event:Event){
    this.selectedValueTo= (event.target as HTMLSelectElement).value;
    this.nameCurrenyFrom= this.selectedValueFrom;
    this.nameCurrenyTo=this.selectedValueTo;
    this.getRate(this.selectedValueFrom,this.selectedValueTo);
  }
  changeAmount(){
    if(!this.amountValue){
      this.amountValue=1;
    }
  }
  
  handleKeyPress(e: KeyboardEvent) {
    const isDigit = /\d/.test(e.key);
    return isDigit;
  }
  switchCurrency(){
    this.selectedValueFrom= this.selectedValueTo;
    this.nameCurrenyTo=this.selectedValueFrom;
    this.getRate(this.selectedValueFrom,this.selectedValueTo);
  }
  convertCurrency(){
   this.totalResult = this.amountValue*this.defaultValueTo;
  }
  goToDetails(){
    this.router.navigate(['/details'], {
      queryParams: {from:this.selectedValueFrom,to:this.selectedValueTo,amountValue:this.amountValue,totalResult:this.totalResult} ,
      queryParamsHandling: 'merge',
    });
  }
}
