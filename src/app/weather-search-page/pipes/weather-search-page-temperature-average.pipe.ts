import { Pipe, PipeTransform } from '@angular/core';
import { TemperatureModel } from '../models';

/**
 * Calculates the rounded average temperature (in degrees celsius) from a list of TemperatureModels.
 */
@Pipe({
  name: 'temperatureAverage'
})
export class TemperatureAveragePipe implements PipeTransform {

  transform(temperatures: TemperatureModel[]): number {
    if(!temperatures) return 0; // SAFE CHECK
    if(temperatures.length === 0) return 0; // SAFE CHECK

    var temperatureSum = 0;
    temperatures.forEach(temperature => temperatureSum += temperature.degreesCelsius);
    return Math.round(temperatureSum/temperatures.length);
  }

}
