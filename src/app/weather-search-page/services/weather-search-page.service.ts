import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, debounceTime, delay, distinctUntilChanged, map, Observable } from 'rxjs';
import { WeatherSearchLocationCountryModel, WeatherSearchLocationModel, WeatherSearchLocationTemperatureModel } from '../models';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class WeatherSearchPageService {
  private weatherSearchLocationCountriesSubject: BehaviorSubject<WeatherSearchLocationCountryModel[] | undefined> = new BehaviorSubject<WeatherSearchLocationCountryModel[] | undefined>(undefined);
  weatherSearchLocationCountries$ = this.weatherSearchLocationCountriesSubject.asObservable();

  private weatherSearchLocationsSubject: BehaviorSubject<WeatherSearchLocationModel[] | undefined> = new BehaviorSubject<WeatherSearchLocationModel[] | undefined>(undefined);
  weatherSearchLocations$ = this.weatherSearchLocationsSubject.asObservable();

  private weatherSearchLocations: WeatherSearchLocationModel[] | undefined = undefined;

  private weatherSearchFilteredLocationsSubject: BehaviorSubject<WeatherSearchLocationModel[] | undefined> = new BehaviorSubject<WeatherSearchLocationModel[] | undefined>(undefined);
  weatherSearchFilteredLocations$ = this.weatherSearchFilteredLocationsSubject.asObservable();

  private weatherSearchLocationTemperaturesSubject: BehaviorSubject<WeatherSearchLocationTemperatureModel[] | undefined> = new BehaviorSubject<WeatherSearchLocationTemperatureModel[] | undefined>(undefined);
  weatherSearchLocationTemperatures$ = this.weatherSearchLocationTemperaturesSubject.asObservable();

  private toggleWeatherSearchLocationCountriesDropdownSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  toggleWeatherSearchLocationCountriesDropdown$ = this.toggleWeatherSearchLocationCountriesDropdownSubject.asObservable();

  private toggleStateWeatherSearchLocationCountriesDropdown: boolean = false;

  private toggleWeatherSearchLocationsDropdownSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  toggleWeatherSearchLocationsDropdown$ = this.toggleWeatherSearchLocationsDropdownSubject.asObservable();

  private toggleStateWeatherSearchLocationsDropdown: boolean = false;

  weatherSearchSelectedCountry: FormControl<WeatherSearchLocationCountryModel | null> = new FormControl<WeatherSearchLocationCountryModel | null>(null);
  weatherSearchSelectedLocation: FormControl<WeatherSearchLocationModel | null> = new FormControl<WeatherSearchLocationModel | null>(null);
  weatherSearchTerm: FormControl<string> = new FormControl<string>('', { nonNullable: true });

  constructor(
    private httpClient: HttpClient
  ) {
    this.weatherSearchLocations$.subscribe(locations => this.weatherSearchLocations = locations);
    this.toggleWeatherSearchLocationCountriesDropdown$.subscribe(toggleState => this.toggleStateWeatherSearchLocationCountriesDropdown = toggleState);
    this.toggleWeatherSearchLocationsDropdown$.subscribe(toggleState => this.toggleStateWeatherSearchLocationsDropdown = toggleState);
    this.weatherSearchTerm.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(200)
    ).subscribe(searchTerm => { this.filterWeatherSearchLocations(searchTerm) });
    this.weatherSearchSelectedCountry.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(country => { if(country) this.refreshWeatherSearchLocations(country.code) });
    this.weatherSearchSelectedLocation.valueChanges.subscribe(location => { 
      if(location) this.refreshWeatherSearchLocationTemperatures(location.code);
      this.weatherSearchTerm.setValue(location?.name ?? '');
    });
  }

  refreshWeatherSearchLocationCountries(): void {
    this.resetWeatherSearch(true, true, true);
    const weatherSearchLocationCountries$ = this.getWeatherSearchLocationCountriesMockData();
    weatherSearchLocationCountries$.subscribe(weatherSearchLocationCountries => {
      this.weatherSearchLocationCountriesSubject.next(weatherSearchLocationCountries);
      if(weatherSearchLocationCountries && weatherSearchLocationCountries.length > 0) this.weatherSearchSelectedCountry.setValue(weatherSearchLocationCountries[0]);
    })
  }

  private refreshWeatherSearchLocations(countryCode: string): void {
    this.resetWeatherSearch(false, true, true);
    const weatherSearchLocations$ = this.getWeatherSearchLocationsMockData(countryCode);
    weatherSearchLocations$.subscribe(weatherSearchLocations => {
      this.weatherSearchLocationsSubject.next(weatherSearchLocations);
      this.filterWeatherSearchLocations('');
    });
  }

  private refreshWeatherSearchLocationTemperatures(locationCode: string): void {
    this.resetWeatherSearch(false, false, true);
    const weatherSearchLocationTemperatures$ = this.getWeatherSearchLocationTemperaturesMockData(locationCode);
    weatherSearchLocationTemperatures$.subscribe(weatherSearchLocationTemperatures => {
      this.weatherSearchLocationTemperaturesSubject.next(weatherSearchLocationTemperatures);
    });
  }

  private resetWeatherSearch(countries: boolean, locations: boolean, temperatures: boolean): void {
    if(countries) {
      this.weatherSearchLocationCountriesSubject.next(undefined);
      this.weatherSearchSelectedCountry.setValue(null);
    }
    if(locations) {
      this.weatherSearchLocationsSubject.next(undefined);
      this.weatherSearchFilteredLocationsSubject.next(undefined);
      this.weatherSearchSelectedLocation.setValue(null);
      this.weatherSearchTerm.setValue('');
    } 
    if(temperatures) {
      this.weatherSearchLocationTemperaturesSubject.next(undefined);
    }
  }

  private filterWeatherSearchLocations(searchTerm: string): void {
    const filteredWeatherSearchLocations = this.weatherSearchLocations?.filter(location => location.name.toLowerCase().includes(searchTerm.toLowerCase())) ?? [];
    this.weatherSearchFilteredLocationsSubject.next(filteredWeatherSearchLocations.length > 0 ? filteredWeatherSearchLocations : this.weatherSearchLocations);
  }

  toggleWeatherSearchLocationCountriesDropdown(): void {
    this.toggleWeatherSearchLocationCountriesDropdownSubject.next(!this.toggleStateWeatherSearchLocationCountriesDropdown);
  }

  toggleWeatherSearchLocationsDropdown(): void {
    this.toggleWeatherSearchLocationsDropdownSubject.next(!this.toggleStateWeatherSearchLocationsDropdown);
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
