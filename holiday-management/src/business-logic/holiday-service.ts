import * as config from 'config';

import HolidayContainer from '../models/holiday-container';
import HolidayContainerRow from '../models/holiday-container-row';
import HolidayUpdate from '../models/holiday-update';
import HolidayRequest from '../models/HolidayRequest';
import RequestType from '../models/request-type';
import CategoryTypes from '../dictionaries/categoryTypes';
import * as HolidayRequestStatuses from '../dictionaries/holiday-request-statuses';
import { DbService } from './../services/db-service';
import AppConfiguration from '../interfaces/app-configuration';

const dbService = new DbService();
const appConfig = config.get('Config') as AppConfiguration;

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

        holidayRequest.isActive = true;
        holidayRequest.status = HolidayRequestStatuses.StatusesIds.waitingForApprove;
        return dbService.createHolidayRequest(holidayRequest);
    }

    async cancelHolidayRequest(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
        let container = await dbService.getHolidayContainer(holidayRequest.userId);
        let category = container.categories.find((c: HolidayContainerRow) => c.category === holidayRequest.type);

        category.taken -= holidayRequest.days;
        category.sum += holidayRequest.days;

        await dbService.updateHolidayContainer(container);
        return holidayRequest;
    }

    getHolidayRequests(userId?: number): Promise<Array<HolidayRequest>> {
        return dbService.getHolidayRequests(userId);
    }

    async updateHolidayRequest(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
        return dbService.updateHolidayRequest(holidayRequest);
    }

    async updateHolidayRequestStatus(id: string, status: string): Promise<HolidayRequest> {
        return new Promise<HolidayRequest>((resolve, reject) => {
            dbService.getHolidayRequest(id)
                .then(request => {
                    let statusObject = HolidayRequestStatuses.getStatusById(status);
                    if (!statusObject) {
                        throw `There is no status with name '${status}'`;
                    }

                    if (appConfig.holidayConfig.holidayRequestTransitions[request.status].findIndex(s => s === status) < 0) {
                        throw `The transition to status '${statusObject.Name}' is prohibited for this holiday request`;
                    }

                    request.status = status;
                    return request;
                })
                .then(request => dbService.updateHolidayRequest(request))
                .then(request => {
                    if (request.status === HolidayRequestStatuses.StatusesIds.cancelledByUser
                        || request.status === HolidayRequestStatuses.StatusesIds.rejected) {
                            return this.cancelHolidayRequest(request);
                    } else {
                        return request;
                    }
                })
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    }
}