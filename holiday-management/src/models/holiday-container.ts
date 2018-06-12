import HolidayContainerRow from './holiday-container-row';
import HolidayUpdate from './holiday-update';

export default class HolidayContainer {
    constructor(
        public _id: object,
        public readonly userId: number,
        public holidaysPerYear: string = null,
        public startDate: Date = null,
        public year: number,
        public isNewEmployee: boolean = true,
        public isFirstMonthCounted: boolean = true,
        public isActive: boolean = true,
        public holidayUpdates: HolidayUpdate[] = [],
        public categories: HolidayContainerRow[] = []
    ) { }
}