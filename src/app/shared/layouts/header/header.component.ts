import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(private readonly router: Router,) { 

  }

  goToDetails(to:string){
    this.router.navigate(['/details'], {
      queryParams: {from:"EUR",to,amountValue:1.00,totalResult:0.00} ,
      queryParamsHandling: 'merge',
    });
  }
}
