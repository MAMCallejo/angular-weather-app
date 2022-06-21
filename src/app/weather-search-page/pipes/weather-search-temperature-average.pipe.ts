import { Pipe, PipeTransform } from '@angular/core';
import { WeatherSearchLocationTemperatureModel } from '../models';

@Pipe({
  name: 'weatherSearchTemperatureAverage'
})
export class WeatherSearchTemperatureAveragePipe implements PipeTransform {

  transform(temperatures: WeatherSearchLocationTemperatureModel[]): number {
    if(temperatures.length === 0) return 0;

    var temperatureSum = 0;
    temperatures.forEach(temperature => temperatureSum += temperature.temperature);
    return Math.round(temperatureSum/temperatures.length);
  }

}
