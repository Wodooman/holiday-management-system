import HolidayCategory from './holiday-category';

// TODO: Rename on HolidayCategory
export default class HolidayContainerRow {
    constructor(
        public readonly category: HolidayCategory,
        public available: number,
        public taken: number,
        public sum: number
    ) { }
}