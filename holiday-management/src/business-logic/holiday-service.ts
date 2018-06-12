import * as config from 'config';

import CategoryTypes from '../dictionaries/categoryTypes';
import * as HolidayRequestStatuses from '../dictionaries/holiday-request-statuses';
import AppConfiguration from '../interfaces/app-configuration';
import HolidayContainer from '../models/holiday-container';
import HolidayContainerRow from '../models/holiday-container-row';
import HolidayRequest from '../models/HolidayRequest';
import { DbService } from './../services/db-service';

const dbService = new DbService();
const appConfig = config.get('Config') as AppConfiguration;

export class HolidayService {
    public testConnection(): Promise<string> {
        return dbService.testConnection();
    }

    public getAllHolidayContainers(year: number = null): Promise<HolidayContainer[]> {
        return dbService.getAllHolidayContainers(year);
    }

    public createHolidayContainer(holidayContainer: HolidayContainer): Promise<HolidayContainer> {
        if (!holidayContainer.categories) {
            holidayContainer.categories = new Array<HolidayContainerRow>();
            CategoryTypes().forEach((category) => {
                const available = category.id === 'holidayOnRequest' ? 4 : 0;
                holidayContainer.categories.push(new HolidayContainerRow(category.id, available, 0, available));
            });
        }
        holidayContainer.year = new Date().getFullYear();
        return dbService.createHolidayContainer(holidayContainer);
    }

    public getHolidayContainer(userId: number): Promise<HolidayContainer> {
        return dbService.getHolidayContainer(userId);
    }

    public deleteAllHolidayContainers(): Promise<void> {
        return dbService.deleteAllHolidayContainers();
    }

    public async updateHolidayContainer(container: HolidayContainer): Promise<HolidayContainer> {
        return dbService.updateHolidayContainer(container);
    }

    public async createHolidayRequest(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
        const container = await dbService.getHolidayContainer(holidayRequest.userId);
        const category = container.categories.find((c: HolidayContainerRow) => c.category === holidayRequest.type);
        // TODO: for normal holidays - take first from prev year and then from Normal
        category.taken += holidayRequest.days;
        category.sum -= holidayRequest.days;
        await dbService.updateHolidayContainer(container);

        holidayRequest.isActive = true;
        holidayRequest.status = HolidayRequestStatuses.StatusesIds.waitingForApprove;
        return dbService.createHolidayRequest(holidayRequest);
    }

    public async cancelHolidayRequest(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
        const container = await dbService.getHolidayContainer(holidayRequest.userId);
        const category = container.categories.find((c: HolidayContainerRow) => c.category === holidayRequest.type);

        category.taken -= holidayRequest.days;
        category.sum += holidayRequest.days;

        await dbService.updateHolidayContainer(container);
        return holidayRequest;
    }

    public getHolidayRequests(userId?: number): Promise<HolidayRequest[]> {
        return dbService.getHolidayRequests(userId);
    }

    public async updateHolidayRequest(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
        return dbService.updateHolidayRequest(holidayRequest);
    }

    public async updateHolidayRequestStatus(id: string, status: string): Promise<HolidayRequest> {
        return dbService.getHolidayRequest(id)
                .then((request) => {
                    const statusObject = HolidayRequestStatuses.getStatusById(status);
                    if (!statusObject) {
                        throw new Error(`There is no status with name '${status}'`);
                    }

                    if (appConfig.holidayConfig.holidayRequestTransitions[request.status].findIndex((s) => s === status) < 0) {
                        throw new Error(`The transition to status '${statusObject.Name}' is prohibited for this holiday request`);
                    }

                    request.status = status;
                    return request;
                })
                .then((request) => dbService.updateHolidayRequest(request))
                .then((request) => {
                    if (request.status === HolidayRequestStatuses.StatusesIds.cancelledByUser
                        || request.status === HolidayRequestStatuses.StatusesIds.rejected) {
                            return this.cancelHolidayRequest(request);
                    } else {
                        return request;
                    }
                });
    }
}