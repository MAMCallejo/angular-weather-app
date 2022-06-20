import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherSearchPageRoutingModule } from './weather-search-page-routing.module';
import { WeatherSearchPageComponent } from './weather-search-page.component';


@NgModule({
  declarations: [
    WeatherSearchPageComponent
  ],
  imports: [
    CommonModule,
    WeatherSearchPageRoutingModule
  ]
})
export class WeatherSearchPageModule { }
