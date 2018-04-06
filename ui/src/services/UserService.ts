import User from '../models/User';
import HolidayContainer from '../models/HolidayContainer';
import UserApi from './api/UsersApi';
import HolidayApi from './api/HolidayApi';

export default class UserService {
    private readonly _userApi: UserApi;
    private readonly _holidayApi: HolidayApi;

    constructor() {
        this._holidayApi = new HolidayApi();
        this._userApi = new UserApi();
    }

    async registerUser(email: string): Promise<User> {
        const user = await this._userApi.registerUser(email);
        const holidays = new HolidayContainer();
        await this._holidayApi.createHolidayContainerForUser(user.id);
        user.holidayContainer = holidays;
        return user;
    }

    async getAllUsers(): Promise<Array<User>> {
        return new Promise<Array<User>>((resolve, reject) => {
            let usersPromise = this._userApi.getAllUsers();
            let holidaysPromise = this._holidayApi.getAllHolidayContainers();
            Promise.all([usersPromise, holidaysPromise])
                .then((value: [Array<User>, Array<HolidayContainer>]) => {
                    let users = value[0];
                    let holidayContainers = value[1];

                    users.forEach(user => {
                        let holidayContainer = holidayContainers.find((h: HolidayContainer) => h.userId === user.id);
                        if (holidayContainer !== undefined) {
                            user.holidayContainer = holidayContainer;
                        }
                    });
                    
                    resolve(users);
                })
            .catch(reject);
        });
    }

    async getUserDeatails(id: number): Promise<User> {
        return this._userApi.getUser(id);
    }

    async updateHolidays(userId: number, holidaysRemaining: number, comment: string): Promise<HolidayContainer> {
        return await this._holidayApi.updateHolidays(userId, holidaysRemaining, comment);
    }
}