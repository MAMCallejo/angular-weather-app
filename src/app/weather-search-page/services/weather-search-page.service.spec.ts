import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WeatherSearchPageService } from './weather-search-page.service';

describe('WeatherSearchPageService', () => {
  let service: WeatherSearchPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(WeatherSearchPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
