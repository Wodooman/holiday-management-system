import HolidayContainer from '../models/holiday-container';
import HolidayContainerRow from '../models/holiday-container-row';
import HolidayUpdate from '../models/holiday-update';
import HolidayRequest from '../models/HolidayRequest';
import RequestType from '../models/request-type';
import CategoryTypes from '../dictionaries/categoryTypes';
import { DbService } from './../services/db-service';
const dbService = new DbService();

export class HolidayService {
    testConnection(): Promise<string> {
        return dbService.testConnection();
    }

    getAllHolidayContainers(year: number = null): Promise<Array<HolidayContainer>> {
        return dbService.getAllHolidayContainers(year);
    }

    createHolidayContainer(holidayContainer: HolidayContainer): Promise<HolidayContainer> {
        if (!holidayContainer.categories) {
            holidayContainer.categories = new Array<HolidayContainerRow>();
            CategoryTypes().forEach(category => {
                var available = category.id === 'holidayOnRequest' ? 4 : 0;
                holidayContainer.categories.push(new HolidayContainerRow(category.id, available, 0, available));
            });
        }
        holidayContainer.year = new Date().getFullYear();
        return dbService.createHolidayContainer(holidayContainer);
    }

    getHolidayContainer(userId: number): Promise<HolidayContainer> {
        return dbService.getHolidayContainer(userId);
    }

    deleteAllHolidayContainers(): Promise<void> {
        return dbService.deleteAllHolidayContainers();
    }

    async updateHolidayContainer(container: HolidayContainer): Promise<HolidayContainer> {
        return dbService.updateHolidayContainer(container);
    }

    async createHolidayRequest(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
        let container = await dbService.getHolidayContainer(holidayRequest.userId);
        let category = container.categories.find((c: HolidayContainerRow) => c.category === holidayRequest.type);
        //TODO: for normal holidays - take first from prev year and then from Normal
        category.taken += holidayRequest.days;
        category.sum -= holidayRequest.days;
        await dbService.updateHolidayContainer(container);

        return dbService.createHolidayRequest(holidayRequest);
    }

    getHolidayRequests(userId?: number): Promise<Array<HolidayRequest>> {
        return dbService.getHolidayRequests(userId);
    }

    async updateHolidayRequest(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
        return dbService.updateHolidayRequest(holidayRequest);
    }
}