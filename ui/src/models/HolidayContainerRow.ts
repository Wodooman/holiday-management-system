export default class HolidayContainerRow {
    constructor(
        public readonly category: string,
        public readonly available: number,
        public readonly taken: number,
        public readonly sum: number
    ) { }
}