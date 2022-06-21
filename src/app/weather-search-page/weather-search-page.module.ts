import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherSearchPageRoutingModule } from './weather-search-page-routing.module';
import { WeatherSearchPageComponent } from './weather-search-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeatherSearchTemperatureAveragePipe } from './pipes/weather-search-temperature-average.pipe';


@NgModule({
  declarations: [
    WeatherSearchPageComponent,
    WeatherSearchTemperatureAveragePipe
  ],
  imports: [
    CommonModule,
    WeatherSearchPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class WeatherSearchPageModule { }
