export default class HolidayRequest {
    constructor(
        public _id: object,
        public readonly userId: number,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly days: number,
        public readonly type: string,
        public readonly comment: string,
        public readonly creationDate: Date,
        public isActive: boolean = true,
        public status: string
    ) { }
}