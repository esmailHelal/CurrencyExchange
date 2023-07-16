import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { StickyPanelModule } from './components/sticky-panel/sticky-panel.module';
import { HomePage } from './pages/home/home.page';
import { MostPopularCurrencyComponent } from './components/most-popular-currency/most-popular-currency.component';


@NgModule({
  declarations: [HomePage, MostPopularCurrencyComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    StickyPanelModule
  ]
})
export class HomeModule { }
