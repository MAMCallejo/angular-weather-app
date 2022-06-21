import { Component, OnInit } from '@angular/core';
import { WeatherSearchPageService } from './services/weather-search-page.service';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-weather-search-page',
  templateUrl: './weather-search-page.component.html',
  styleUrls: ['./weather-search-page.component.css'],
  animations: [
    fadeInOnEnterAnimation({ anchor : 'fadeIn' })
  ]
})
export class WeatherSearchPageComponent implements OnInit {

  constructor(
    public weatherSearchPageService: WeatherSearchPageService
  ) { }

  ngOnInit(): void {
    this.weatherSearchPageService.refreshWeatherSearchLocationCountries();
  }

}
