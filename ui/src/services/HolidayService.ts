import HolidayRequest from '../models/HolidayRequest';
import HolidayContainer from '../models/HolidayContainer';
import HolidayApi from './api/HolidayApi';


export default class HolidayService {
    private readonly _holidayApi: HolidayApi;

    constructor() {
        this._holidayApi = new HolidayApi();
    }

    async createHolidayRequest(userId: number, startDate: Date, endDate: Date, days: number, type: string, comment: string, creationDate: Date)
    : Promise<HolidayRequest> {
        const holidayRequest = await this._holidayApi.createHolidayRequest(userId, startDate, endDate, days, type, comment, creationDate);
        return holidayRequest;
    }

    async getAllHolidayRequests(): Promise<Array<HolidayRequest>> {
        return this._holidayApi.getAllHolidayRequests();
    }

    async getHolidayRequestsForUser(userId: number): Promise<Array<HolidayRequest>> {
        return this._holidayApi.getHolidayRequestsForUser(userId);
    }

    async getHolidayContainer(userId: number): Promise<HolidayContainer> {
        return this._holidayApi.getHolidaysForUser(userId);
    }

    async changeHolidayRequestStatus(holidayRequestId: string, status: string): Promise<HolidayRequest> {
        return this._holidayApi.changeHolidayRequestStatus(holidayRequestId, status);
    }
}