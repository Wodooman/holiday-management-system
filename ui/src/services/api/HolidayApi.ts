import HolidayContainer from '../../models/HolidayContainer';
import HolidayRequest from '../../models/HolidayRequest';
import HolidayContainerContract from './contracts/HolidayContainerContract';
import HolidayRequestContract from './contracts/HolidayRequestContract';

export default class HolidayApi {

    createHolidayContainerForUser(userId: number): Promise<HolidayContainer> {
        return new Promise((resolve, reject) => {
            fetch('/api/holidays', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error while accessing HolidayService. Details: (${response.status})${response.statusText}`);
                    } else {
                        return response.json();
                    }
                })
                .then((data: HolidayContainerContract) => resolve(this.formatHolidayContainer(data)))
                .catch(reject);
        });
    }

    getAllHolidayContainers(): Promise<Array<HolidayContainer>> {
        return new Promise((resolve, reject) => {
            fetch(`/api/holidays`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error while accessing HolidayService. Details: (${response.status})${response.statusText}`);
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    resolve(data.map((entry: HolidayContainerContract) => {
                        return new HolidayContainer(entry.userId, entry.categories);
                    }));
                })
                .catch(reject);
        });
    }

    getHolidaysForUser(userId: number): Promise<HolidayContainer> {
        return new Promise((resolve, reject) => {
            fetch(`/api/holidays/${userId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error while accessing HolidayService. Details: (${response.status})${response.statusText}`);
                    } else {
                        return response.json();
                    }
                })
                .then((data: HolidayContainerContract) => resolve(this.formatHolidayContainer(data)))
                .catch(reject);
        });
    }

    updateHolidays(userId: number, holidaysRemaining: number, comment: string): Promise<HolidayContainer> {
        return new Promise((resolve, reject) => {
            fetch(`/api/holidayUpdates`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    // leftHolidays: holidaysRemaining,
                    comment
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error while accessing HolidayService. Details: (${response.status})${response.statusText}`);
                } else {
                    return response.json();
                }
            })
            .then((data: HolidayContainerContract) => resolve(this.formatHolidayContainer(data)))
            .catch(reject);
        });
    }

    createHolidayRequest(userId: number, startDate: Date, endDate: Date, days: number, type: string, comment: string, creationDate: Date)
        : Promise<HolidayRequest> {
        return new Promise((resolve, reject) => {
            fetch('/api/holidayRequests', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    startDate: startDate,
                    endDate: endDate,
                    days: days,
                    type: type,
                    comment: comment,
                    creationDate: creationDate
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error while accessing HolidayService. Details: (${response.status})${response.statusText}`);
                } else {
                    return response.json();
                }
            })
            .then((data: HolidayRequestContract) => resolve(this.formatHolidayRequest(data)))
            .catch(reject);
        });
    }

    getAllHolidayRequests(): Promise<Array<HolidayRequest>> {
        return new Promise((resolve, reject) => {
            fetch(`/api/holidayRequests`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error while accessing HolidayService. Details: (${response.status})${response.statusText}`);
                    } else {
                        return response.json();
                    }
                })
                .then((data: Array<HolidayRequestContract>) => {
                    resolve(data.map((entry: HolidayRequestContract) => this.formatHolidayRequest(entry)));
                })
                .catch(reject);
        });
    }

    getHolidayRequestsForUser(userId: number): Promise<Array<HolidayRequest>> {
        return new Promise((resolve, reject) => {
            fetch(`/api/holidayRequests/${userId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error while accessing HolidayService. Details: (${response.status})${response.statusText}`);
                    } else {
                        return response.json();
                    }
                })
                .then((data: Array<HolidayRequestContract>) => {
                    resolve(data.map((entry: HolidayRequestContract) => this.formatHolidayRequest(entry)));
                })
                .catch(reject);
        });
    }

    changeHolidayRequestStatus(holidayRequestId: string, status: string): Promise<HolidayRequest> {
        return new Promise((resolve, reject) => {
            fetch(`/api/holidayRequests/${holidayRequestId}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: status
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error while accessing HolidayService. Details: (${response.status})${response.statusText}`);
                } else {
                    return response.json();
                }
            })
            .then((data: HolidayRequestContract) => resolve(this.formatHolidayRequest(data)))
            .catch(reject);
        });
    }

    formatHolidayRequest(data: HolidayRequestContract): HolidayRequest {
        return new HolidayRequest(
            data._id, new Date(data.startDate), new Date(data.endDate), 
            data.days, data.type, data.comment, data.userId, new Date(data.creationDate), data.status, undefined);
    }

    formatHolidayContainer(data: HolidayContainerContract): HolidayContainer {
        return new HolidayContainer(
            data.userId, data.categories, data.holidaysPerYear, new Date(data.startDate), data.isNewEmployee, data.isFirstMonthCounted);
    }
}