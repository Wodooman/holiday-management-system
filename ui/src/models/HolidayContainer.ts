import HolidayContainerRow from './HolidayContainerRow';

export default class HolidayContainer {
    constructor(
        public readonly userId?: number,
        public categories?: Array<HolidayContainerRow>,
        public holidaysPerYear?: string,
        public startDate?: Date,
        public isNewEmployee: boolean = true,
        public isFirstMonthCounted: boolean = true
    ) {
    }
}