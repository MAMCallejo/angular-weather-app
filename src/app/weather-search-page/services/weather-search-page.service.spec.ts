import { TestBed } from '@angular/core/testing';

import { WeatherSearchPageService } from './weather-search-page.service';

describe('WeatherSearchPageService', () => {
  let service: WeatherSearchPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherSearchPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
