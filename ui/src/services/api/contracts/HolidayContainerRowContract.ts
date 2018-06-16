import HolidayCategory from './HolidayCategory';

export default interface HolidayContainerRowContract {
    category: HolidayCategory;
    available: number;
    taken: number;
    sum: number;
}