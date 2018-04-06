import HolidayContainer from './HolidayContainer';
import HolidayRequest from './HolidayRequest';

export default class User {

    constructor(public readonly id: number,
                public readonly firstName: string,
                public readonly lastName: string,
                public readonly email: string,
                public readonly accountName: string,
                public requests: Array<HolidayRequest> = [],
                private _holidayContainer?: HolidayContainer
            ) {
    }

    public get holidayContainer() {
        return this._holidayContainer;
    }

    public set holidayContainer(value:  HolidayContainer | undefined) {
        this._holidayContainer = value;
    }
}