import { Component, OnInit } from '@angular/core';
import { WeatherSearchPageService } from './services/weather-search-page.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
/**
 * Displays a search bar to pick a location from and shows the weekly temperature.
 * The weather search page service is imported and used directly in the DOM.
 */
@Component({
  selector: 'app-weather-search-page',
  templateUrl: './weather-search-page.component.html',
  styleUrls: ['./weather-search-page.component.css'],
  animations: [
    fadeInOnEnterAnimation({ anchor : 'fadeIn' }) // Smooths *ngIf transitions
  ]
})
export class WeatherSearchPageComponent implements OnInit {

  constructor(
    public weatherSearchPageService: WeatherSearchPageService
  ) { }

  ngOnInit(): void {
    this.weatherSearchPageService.refreshCountries(); // Refreshes list of countries on the search bar
  }

}
