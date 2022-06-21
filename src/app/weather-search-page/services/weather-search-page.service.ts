import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, debounceTime, delay, distinctUntilChanged, map, Observable } from 'rxjs';
import { CountryModel, LocationModel, TemperatureModel } from '../models';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class WeatherSearchPageService {
  
  // Private subjects (async sources of data for service use only):
  private _countriesSubject: BehaviorSubject<CountryModel[] | undefined> = new BehaviorSubject<CountryModel[] | undefined>(undefined);
  private _locationsSubject: BehaviorSubject<LocationModel[] | undefined> = new BehaviorSubject<LocationModel[] | undefined>(undefined);
  private _filteredLocationsSubject: BehaviorSubject<LocationModel[] | undefined> = new BehaviorSubject<LocationModel[] | undefined>(undefined);
  private _temperaturesSubject: BehaviorSubject<TemperatureModel[] | undefined> = new BehaviorSubject<TemperatureModel[] | undefined>(undefined);
  private _toggleCountriesDropdownSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _toggleLocationsDropdownSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  // Public observables (async sources of data used directly on the component DOM):
  countries$ = this._countriesSubject.asObservable();
  locations$ = this._locationsSubject.asObservable();
  filteredLocations$ = this._filteredLocationsSubject.asObservable();
  temperatures$ = this._temperaturesSubject.asObservable();
  toggleCountriesDropdown$ = this._toggleCountriesDropdownSubject.asObservable();
  toggleLocationsDropdown$ = this._toggleLocationsDropdownSubject.asObservable();

  // Private local variables (copies of observables data for service use only):
  private _locations: LocationModel[] | undefined = undefined;
  private _toggleStateCountriesDropdown: boolean = false;
  private _toggleStateLocationsDropdown: boolean = false;

  // Public user input controls (hold state of user input and triggers service logic):
  selectedCountry: FormControl<CountryModel | null> = new FormControl<CountryModel | null>(null);
  selectedLocation: FormControl<LocationModel | null> = new FormControl<LocationModel | null>(null);
  searchTerm: FormControl<string> = new FormControl<string>('', { nonNullable: true });

  constructor(
    private httpClient: HttpClient
  ) {
    // Subscribes to public observables to create local copies of the data.
    this.locations$.subscribe(locations => this._locations = locations);
    this.toggleCountriesDropdown$.subscribe(toggleState => this._toggleStateCountriesDropdown = toggleState);
    this.toggleLocationsDropdown$.subscribe(toggleState => this._toggleStateLocationsDropdown = toggleState);

    // Subscribes to changes in value of the user input controls and triggers service functions.
    this.searchTerm.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(200)
    ).subscribe(searchTerm => { this._filterLocations(searchTerm) });
    this.selectedCountry.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(country => { if(country) this.refreshWeatherSearchLocations(country.code) });
    this.selectedLocation.valueChanges.subscribe(location => { 
      if(location) this.refreshTemperatures(location.code);
      this.searchTerm.setValue(location?.name ?? '');
    });
  }

  /**
   * Resets service.
   * Fetches countries mock data and refreshes observable and selected country input control.
   */
  refreshCountries(): void {
    this.resetCountries();
    const countriesMockData$ = this._getCountriesMockData();
    countriesMockData$.subscribe(countries => {
      this._countriesSubject.next(countries);
      if(countries && countries.length > 0) this.selectedCountry.setValue(countries[0]);
    })
  }

  /**
   * Toggles countries selection dropdown visibility.
   */
  toggleCountriesDropdown(): void {
    this._toggleCountriesDropdownSubject.next(!this._toggleStateCountriesDropdown);
  }

  /**
   * Toggles locations selection dropdown visibility.
   */
  toggleLocationsDropdown(): void {
    this._toggleLocationsDropdownSubject.next(!this._toggleStateLocationsDropdown);
  }

  /*
    Resets locations (and temperatures), fetches mock data according to the country code passed, and refreshes observable.
    Sets filtered locations to default (show all).
  */ 
  private refreshWeatherSearchLocations(countryCode: string): void {
    this.resetLocations();
    const weatherSearchLocations$ = this._getLocationsMockData(countryCode);
    weatherSearchLocations$.subscribe(weatherSearchLocations => {
      this._locationsSubject.next(weatherSearchLocations);
      this._filterLocations('');
    });
  }

  // Resets temperatures, fetches mock data according to the location code passed, and refreshes observable.
  private refreshTemperatures(locationCode: string): void {
    this._resetTemperatures();
    const temperatures$ = this._getTemperaturesMockData(locationCode);
    temperatures$.subscribe(temperatures => {
      this._temperaturesSubject.next(temperatures);
    });
  }

  // Resets countries observable and user input control.
  private resetCountries(): void {
    this._countriesSubject.next(undefined);
    this.selectedCountry.setValue(null);

    this.resetLocations(); // Resets locations since selected country has been reset.
  }

  // Resets locations observables and user input controls.
  private resetLocations(): void {
    this._locationsSubject.next(undefined);
    this._filteredLocationsSubject.next(undefined);
    this.selectedLocation.setValue(null);
    this.searchTerm.setValue('');

    this._resetTemperatures(); // Resets temperatures since selected location has been reset.
  }

  // Resets temperatures observable.
  private _resetTemperatures(): void {
    this._temperaturesSubject.next(undefined);
  }

  // Filters locations based on search term inputted by the user.
  private _filterLocations(searchTerm: string): void {
    const filteredLocations = this._locations?.filter(location => location.name.toLowerCase().includes(searchTerm.toLowerCase())) ?? [];
    this._filteredLocationsSubject.next(filteredLocations.length > 0 ? filteredLocations : this._locations);
  }

  // Fetches countries mock data. Simulates a response delay.
  private _getCountriesMockData(): Observable<CountryModel[] | undefined> {
    return this.httpClient.get("assets/mock-data/weather-search-page-countries-mock-data.json").pipe(
      delay(200),
      map(response => (response as CountryModel[]) ?? undefined)
    );
  }

  // Fetches locations mock data. Filters response based on country code passed. Simulates a response delay.
  private _getLocationsMockData(countryCode: string): Observable<LocationModel[] | undefined> {
    return this.httpClient.get("assets/mock-data/weather-search-page-locations-mock-data.json").pipe(
      delay(300),
      map(response => {
        const locationsMockData = response as LocationModel[];
        if (!locationsMockData) return undefined;
        return locationsMockData.filter(location => location.countryCode === countryCode);
      })
    );
  }

  // Fetches temperatures mock data. Filters response based on location code passed. Simulates a response delay.
  private _getTemperaturesMockData(locationCode: string): Observable<TemperatureModel[] | undefined> {
    return this.httpClient.get("assets/mock-data/weather-search-page-temperatures-mock-data.json").pipe(
      delay(500),
      map(response => {
        const temperaturesMockData = response as TemperatureModel[];
        if (!temperaturesMockData) return undefined;
        return temperaturesMockData.filter(temperature => temperature.locationCode === locationCode);
      })
    );
  }
}
