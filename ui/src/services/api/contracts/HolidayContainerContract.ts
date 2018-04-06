import HolidayContainerRowContract from './HolidayContainerRowContract';

export default interface HolidayContainerContract {
    userId: number;
    holidaysPerYear: string;
    startDate: string;
    isNewEmployee: boolean;
    isFirstMonthCounted: boolean;
    categories: Array<HolidayContainerRowContract>;
}