import User from '../../models/User';
import HolidayRequest from '../../models/HolidayRequest';

export default class State {
    isDrawerOpen: boolean;
    progress: {
        counter: number;
        show: boolean;
    };
    users: Array<User>;
    requests: Array<HolidayRequest>;
}