import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, delay, map, Observable } from 'rxjs';
import { WeatherSearchLocationCountryModel, WeatherSearchLocationModel, WeatherSearchLocationTemperatureModel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WeatherSearchPageService {
  private weatherSearchLocationCountriesSubject: BehaviorSubject<WeatherSearchLocationCountryModel[] | undefined> = new BehaviorSubject<WeatherSearchLocationCountryModel[] | undefined>(undefined);
  weatherSearchLocationCountries$ = this.weatherSearchLocationCountriesSubject.asObservable();

  private weatherSearchLocationsSubject: BehaviorSubject<WeatherSearchLocationModel[] | undefined> = new BehaviorSubject<WeatherSearchLocationModel[] | undefined>(undefined);
  weatherSearchLocations$ = this.weatherSearchLocationsSubject.asObservable();

  private weatherSearchLocationTemperaturesSubject: BehaviorSubject<WeatherSearchLocationTemperatureModel[] | undefined> = new BehaviorSubject<WeatherSearchLocationTemperatureModel[] | undefined>(undefined);
  weatherSearchLocationTemperatures$ = this.weatherSearchLocationTemperaturesSubject.asObservable();

  constructor(
    private httpClient: HttpClient
  ) { }

  refreshWeatherSearchLocationCountries(): void {
    this.weatherSearchLocationCountriesSubject.next(undefined);
    const weatherSearchLocationCountries$ = this.getWeatherSearchLocationCountriesMockData();
    weatherSearchLocationCountries$.subscribe(weatherSearchLocationCountries => {
      this.weatherSearchLocationCountriesSubject.next(weatherSearchLocationCountries);
      if(weatherSearchLocationCountries && weatherSearchLocationCountries.length > 0) this.refreshWeatherSearchLocations(weatherSearchLocationCountries[0].code);
    })
  }

  refreshWeatherSearchLocations(countryCode: string): void {
    this.weatherSearchLocationsSubject.next(undefined);
    const weatherSearchLocations$ = this.getWeatherSearchLocationsMockData(countryCode);
    weatherSearchLocations$.subscribe(weatherSearchLocations => {
      this.weatherSearchLocationsSubject.next(weatherSearchLocations);
      if(weatherSearchLocations && weatherSearchLocations.length > 0) this.refreshWeatherSearchLocationTemperatures(weatherSearchLocations[0].code);
    });
  }

  refreshWeatherSearchLocationTemperatures(locationCode: string): void {
    this.weatherSearchLocationTemperaturesSubject.next(undefined);
    const weatherSearchLocationTemperatures$ = this.getWeatherSearchLocationTemperaturesMockData(locationCode);
    weatherSearchLocationTemperatures$.subscribe(weatherSearchLocationTemperatures => {
      this.weatherSearchLocationTemperaturesSubject.next(weatherSearchLocationTemperatures);
    });
  }

  private getWeatherSearchLocationCountriesMockData(): Observable<WeatherSearchLocationCountryModel[] | undefined> {
    return this.httpClient.get("assets/mock-data/weather-search-location-countries-mock-data.json").pipe(
      delay(200),
      map(response => {
        const weatherSearchLocationCountriesMockData = response as WeatherSearchLocationCountryModel[];
        return weatherSearchLocationCountriesMockData;
      })
    );
  }

  private getWeatherSearchLocationsMockData(countryCode: string): Observable<WeatherSearchLocationModel[] | undefined> {
    return this.httpClient.get("assets/mock-data/weather-search-locations-mock-data.json").pipe(
      delay(300),
      map(response => {
        const weatherSearchLocationsMockData = response as WeatherSearchLocationModel[];
        if (!weatherSearchLocationsMockData) return undefined;
        return weatherSearchLocationsMockData.filter(weatherSearchLocationMockData => weatherSearchLocationMockData.countryCode === countryCode);
      })
    );
  }

  private getWeatherSearchLocationTemperaturesMockData(locationCode: string): Observable<WeatherSearchLocationTemperatureModel[] | undefined> {
    return this.httpClient.get("assets/mock-data/weather-search-location-temperatures-mock-data.json").pipe(
      delay(500),
      map(response => {
        const weatherSearchLocationTemperaturesMockData = response as WeatherSearchLocationTemperatureModel[];
        if (!weatherSearchLocationTemperaturesMockData) return undefined;
        return weatherSearchLocationTemperaturesMockData.filter(weatherSearchLocationTemperatureMockData => weatherSearchLocationTemperatureMockData.locationCode === locationCode);
      })
    );
  }
}
