// TODO: Rename on HolidayCategory
export default class HolidayContainerRow {
    constructor(
        public readonly category: string,
        public available: number,
        public taken: number,
        public sum: number
    ) { }
}