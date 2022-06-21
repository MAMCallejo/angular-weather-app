import { WeekDayEnum } from ".";

export interface TemperatureModel {
    day: WeekDayEnum;
    degreesCelsius: number;
    locationCode: string;
}