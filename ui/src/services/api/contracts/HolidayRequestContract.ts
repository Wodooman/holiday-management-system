export default interface HolidayContainerContract {
    _id: string;
    userId: number;
    startDate: string;
    endDate: string;
    days: number;
    type: string;
    comment: string;
    creationDate: string;
    status: string;
}