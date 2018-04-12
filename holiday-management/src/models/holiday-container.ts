import HolidayUpdate from './holiday-update';
import HolidayContainerRow from './holiday-container-row';

export default class HolidayContainer {
    constructor(
        public _id: Object,
        public readonly userId: number,
        public holidaysPerYear: string = null,
        public startDate: Date = null,
        public year: number,
        public isNewEmployee: boolean = true,
        public isFirstMonthCounted: boolean = true,
        public isActive: boolean = true,
        public holidayUpdates: Array<HolidayUpdate> = [],
        public categories: Array<HolidayContainerRow> = []
    ) { }
}