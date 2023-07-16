import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StickyPanelComponent } from './sticky-panel.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    StickyPanelComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    StickyPanelComponent
  ]
})
export class StickyPanelModule { }
