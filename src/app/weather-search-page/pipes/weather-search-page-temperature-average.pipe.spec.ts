import { TemperatureAveragePipe } from './weather-search-page-temperature-average.pipe';

describe('TemperatureAveragePipe', () => {
  it('create an instance', () => {
    const pipe = new TemperatureAveragePipe();
    expect(pipe).toBeTruthy();
  });
});
