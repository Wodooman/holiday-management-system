import { MongoClient, ObjectID } from 'mongodb';
import * as config from 'config';

import HolidayContainer from '../models/holiday-container';
import HolidayUpdate from '../models/holiday-update';
import HolidayRequest from '../models/HolidayRequest';
import AppConfiguration from '../interfaces/app-configuration';

const appConfig = config.get('Config') as AppConfiguration;

//TODO: Move logging to some log library instead of logging to console

const holidayContainerCollection = 'holidayContainers';
const holidayRequestCollection = 'holidayRequests';

export class DbService {
    testConnection(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            MongoClient.connect(appConfig.dbConnectionString)
                .then(client => {
                    const db = client.db(appConfig.mainDbName);
                    client.close();
                    resolve('Connected to MongoDB');
                })
                .catch(error => reject(error));
        });
    }

    getAllHolidayContainers(year: number = null): Promise<Array<HolidayContainer>> {
        return new Promise<Array<HolidayContainer>>((resolve, reject) => {
            MongoClient.connect(appConfig.dbConnectionString)
                .then(client => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayContainerCollection);

                    let yearToSelect = year ? year : new Date().getFullYear();

                    collection.find({'year': yearToSelect }).toArray((err, docs) => {
                        if (err) { throw err; }

                        client.close();
                        resolve(docs);
                    });
                })
                .catch(error => reject(error));
        });
    }

    createHolidayContainer(holidayContainer: HolidayContainer): Promise<HolidayContainer> {
        return new Promise<HolidayContainer>((resolve, reject) => {
            MongoClient.connect(appConfig.dbConnectionString)
                .then(client => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayContainerCollection);

                    collection.insert(holidayContainer, (err, result) => {
                        if (err) { throw err; }

                        client.close();
                        resolve(holidayContainer);
                    });
                })
                .catch(error => reject(error));
        });
    }

    getHolidayContainer(userId: number): Promise<HolidayContainer> {
        return new Promise<HolidayContainer>((resolve, reject) => {
            MongoClient.connect(appConfig.dbConnectionString)
                .then(client => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayContainerCollection);

                    collection.findOne({ 'userId': userId, 'isActive': true }, (err, doc) => {
                        if (err) { throw err; }

                        client.close();
                        resolve(doc);
                    });
                })
                .catch(error => reject(error));
        });
    }

    deleteAllHolidayContainers(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            MongoClient.connect(appConfig.dbConnectionString)
                .then(client => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayContainerCollection);

                    collection.deleteMany({});
                    client.close();
                    resolve();
                })
                .catch(error => reject(error));
        });
    }

    updateHolidayContainer(holidayContainer: HolidayContainer): Promise<HolidayContainer> {
        return new Promise<HolidayContainer>((resolve, reject) => {
            MongoClient.connect(appConfig.dbConnectionString)
                .then(client => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayContainerCollection);

                    delete holidayContainer._id; //Note: needed as Mongo tries to update all fields, which are in the entity
                    collection.update({ 'userId': holidayContainer.userId }, holidayContainer)
                        .then(() => {
                            client.close();
                            resolve(holidayContainer);
                        })
                        .catch(err => reject(err));
                })
                .catch(error => reject(error));
        });
    }

    createHolidayRequest(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
        return new Promise<HolidayRequest>((resolve, reject) => {
            MongoClient.connect(appConfig.dbConnectionString)
                .then(client => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayRequestCollection);

                    collection.insert(holidayRequest, (err, result) => {
                        if (err) { throw err; }

                        client.close();
                        resolve(holidayRequest);
                    });
                })
                .catch(error => reject(error));
        });
    }

    getHolidayRequests(userId?: number): Promise<Array<HolidayRequest>> {
        return new Promise<Array<HolidayRequest>>((resolve, reject) => {
            MongoClient.connect(appConfig.dbConnectionString)
                .then(client => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayRequestCollection);
                    let request = userId === undefined ? {} : { 'userId': userId, 'isActive': true };

                    collection.find(request).toArray((err, result) => {
                        client.close();

                        if (err) { throw err; }
                        resolve(result);
                    });
                })
                .catch(error => reject(error));
        });
    }

    getHolidayRequest(id: string): Promise<HolidayRequest> {
        return new Promise<HolidayRequest>((resolve, reject) => {
            MongoClient.connect(appConfig.dbConnectionString)
                .then(client => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayRequestCollection);
                    let convertedId = null;
                    try {
                        convertedId = ObjectID.createFromHexString(id);
                    } catch (err) {
                        throw 'Given Id is not in correct format';
                    }

                    collection.findOne({'_id': convertedId}, (err, document) => {
                        client.close();

                        if (err) { throw err; }
                        if (!document) {
                            reject('No holiday request with such Id');
                        } else {
                            resolve(document);
                        }
                    });
                })
                .catch(error => reject(error));
        });
    }

    updateHolidayRequest(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
        return new Promise<HolidayRequest>((resolve, reject) => {
            if (!holidayRequest) {
                reject('No holiday request');
            }

            MongoClient.connect(appConfig.dbConnectionString)
                .then(client => {
                    const db = client.db(appConfig.mainDbName);
                    const collection = db.collection(holidayRequestCollection);

                    let id = holidayRequest._id;
                    delete holidayRequest._id; //Note: needed as Mongo tries to update all fields, which are in the entity
                    collection.update({ '_id': id }, holidayRequest)
                        .then(() => {
                            client.close();
                            resolve(holidayRequest);
                        })
                        .catch(err => reject(err));
                })
                .catch(error => reject(error));
        });
    }

}