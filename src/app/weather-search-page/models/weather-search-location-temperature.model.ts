import { WeatherSearchLocationDayEnum } from ".";

export interface WeatherSearchLocationTemperatureModel {
    day: WeatherSearchLocationDayEnum;
    temperature: number;
    locationCode: string;
}