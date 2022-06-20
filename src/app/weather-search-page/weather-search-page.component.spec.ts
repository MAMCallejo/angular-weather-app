import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherSearchPageComponent } from './weather-search-page.component';

describe('WeatherSearchPageComponent', () => {
  let component: WeatherSearchPageComponent;
  let fixture: ComponentFixture<WeatherSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeatherSearchPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
