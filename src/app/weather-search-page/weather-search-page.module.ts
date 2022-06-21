import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherSearchPageComponent } from './weather-search-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemperatureAveragePipe } from './pipes/weather-search-page-temperature-average.pipe';

/**
 * It declares all components and pipes of the weather search page.
 */
@NgModule({
  declarations: [
    WeatherSearchPageComponent,
    TemperatureAveragePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class WeatherSearchPageModule { }
