import { MongoClient } from 'mongodb';
import HolidayContainer from '../models/holiday-container';
import HolidayUpdate from '../models/holiday-update';
import HolidayRequest from '../models/HolidayRequest';

//TODO: Move logging to some log library instead of logging to console
//TODO: Move configuration to config file
const url = 'mongodb://localhost:27017';
const dbName = 'holidayServiceDB';
const holidayContainerCollection = 'holidayContainers';
const holidayRequestCollection = 'holidayRequests';

export class DbService {
    testConnection(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            MongoClient.connect(url)
                .then(client => {
                    const db = client.db(dbName);
                    client.close();
                    resolve('Connected to MongoDB');
                })
                .catch(error => reject(error));
        });
    }

    getAllHolidayContainers(year: number = null): Promise<Array<HolidayContainer>> {
        return new Promise<Array<HolidayContainer>>((resolve, reject) => {
            MongoClient.connect(url)
                .then(client => {
                    const db = client.db(dbName);
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
            MongoClient.connect(url)
                .then(client => {
                    const db = client.db(dbName);
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
            MongoClient.connect(url)
                .then(client => {
                    const db = client.db(dbName);
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
            MongoClient.connect(url)
                .then(client => {
                    const db = client.db(dbName);
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
            MongoClient.connect(url)
                .then(client => {
                    const db = client.db(dbName);
                    const collection = db.collection(holidayContainerCollection);

                    collection.update({ 'userId': holidayContainer.userId }, holidayContainer);
                    client.close();

                    resolve(holidayContainer);
                })
                .catch(error => reject(error));
        });
    }

    createHolidayRequest(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
        return new Promise<HolidayRequest>((resolve, reject) => {
            MongoClient.connect(url)
                .then(client => {
                    const db = client.db(dbName);
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
            MongoClient.connect(url)
                .then(client => {
                    const db = client.db(dbName);
                    const collection = db.collection(holidayRequestCollection);
                    let request = userId === undefined ? {} : { 'userId': userId, 'isActive': true };

                    collection.find(request).toArray((err, result) => {
                        if (err) { throw err; }

                        client.close();
                        resolve(result);
                    });
                })
                .catch(error => reject(error));
        });
    }

    updateHolidayRequest(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
        return new Promise<HolidayRequest>((resolve, reject) => {
            MongoClient.connect(url)
                .then(client => {
                    const db = client.db(dbName);
                    const collection = db.collection(holidayRequestCollection);

                    collection.update({ '_id': holidayRequest._id }, holidayRequest);
                    client.close();

                    resolve(holidayRequest);
                })
                .catch(error => reject(error));
        });
    }

}