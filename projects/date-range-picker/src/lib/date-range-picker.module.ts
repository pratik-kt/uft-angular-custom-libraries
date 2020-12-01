import { NgModule } from '@angular/core';
import { DateRangePickerComponent } from './date-range-picker.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [DateRangePickerComponent],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [DateRangePickerComponent]
})
export class DateRangePickerModule { }
