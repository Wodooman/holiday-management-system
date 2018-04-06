export default class HolidayRequest {
    constructor(
        public readonly _id: string,
        public readonly userId: number,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly days: number,
        public readonly type: string,
        public readonly comment: string,
        public readonly creationDate: Date,
        public readonly status: string,
        public isActive: boolean = true
    ) { }
}