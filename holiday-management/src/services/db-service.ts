import * as config from 'config';
import { MongoClient, ObjectID } from 'mongodb';

import AppConfiguration from '../interfaces/app-configuration';
import HolidayContainer from '../models/holiday-container';
import HolidayRequest from '../models/HolidayRequest';

const appConfig = config.get('Config') as AppConfiguration;

// TODO: Move logging to some log library instead of logging to console

const holidayContainerCollection = 'holidayContainers';
const holidayRequestCollection = 'holidayRequests';

export class DbService {
    public testConnection(): Promise<string> {
        return MongoClient.connect(appConfig.dbConnectionString)
            .then((client) => {
                client.db(appConfig.mainDbName);
                client.close();
                return 'Connected to MongoDB';
            });
    }

    public getAllHolidayContainers(year: number = null): Promise<HolidayContainer[]> {
        return MongoClient.connect(appConfig.dbConnectionString)
                .then((client) => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayContainerCollection);

                    const yearToSelect = year ? year : new Date().getFullYear();

                    return collection.find({year: yearToSelect }).toArray();
                });
    }

    public createHolidayContainer(holidayContainer: HolidayContainer): Promise<HolidayContainer> {
        return MongoClient.connect(appConfig.dbConnectionString)
                .then((client) => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayContainerCollection);

                    return collection.insertOne(holidayContainer);
                })
                .then(() => holidayContainer);
    }

    public getHolidayContainer(userId: number): Promise<HolidayContainer> {
        return MongoClient.connect(appConfig.dbConnectionString)
                .then((client) => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayContainerCollection);

                    return collection.findOne({ userId, isActive: true });
                });
    }

    public deleteAllHolidayContainers(): Promise<void> {
        return MongoClient.connect(appConfig.dbConnectionString)
                .then((client) => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayContainerCollection);

                    return collection.deleteMany({});
                })
                .then(() => null);
    }

    public updateHolidayContainer(holidayContainer: HolidayContainer): Promise<HolidayContainer> {
        return MongoClient.connect(appConfig.dbConnectionString)
                .then((client) => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayContainerCollection);

                    delete holidayContainer._id; // Note: needed as Mongo tries to update all fields, which are in the entity
                    return collection.update({ userId: holidayContainer.userId }, holidayContainer);
                })
                .then(() => holidayContainer);
    }

    public createHolidayRequest(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
        return MongoClient.connect(appConfig.dbConnectionString)
                .then((client) => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayRequestCollection);

                    return collection.insert(holidayRequest);
                })
                .then(() => holidayRequest);
    }

    public getHolidayRequests(userId?: number): Promise<HolidayRequest[]> {
        return MongoClient.connect(appConfig.dbConnectionString)
                .then((client) => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayRequestCollection);
                    const request = userId === undefined ? {} : { userId, isActive: true };
                    const sort = { creationDate: -1 };

                    return collection.find(request).sort(sort).toArray();
                });
    }

    public getHolidayRequest(id: string): Promise<HolidayRequest> {
        return MongoClient.connect(appConfig.dbConnectionString)
                .then((client) => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayRequestCollection);
                    let convertedId = null;
                    try {
                        convertedId = ObjectID.createFromHexString(id);
                    } catch (err) {
                        throw new Error('Given Id is not in correct format');
                    }

                    return collection.findOne({_id: convertedId});
                }).then((result) => {
                    if (!result) {
                        throw new Error('No holiday request with such Id');
                    }
                    return result;
                });
    }

    public updateHolidayRequest(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
        return MongoClient.connect(appConfig.dbConnectionString)
                .then((client) => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayRequestCollection);

                    const id = holidayRequest._id;
                    delete holidayRequest._id; // Note: needed as Mongo tries to update all fields, which are in the entity
                    return collection.update({ _id: id }, holidayRequest);
                })
                .then(() => holidayRequest);
    }
}