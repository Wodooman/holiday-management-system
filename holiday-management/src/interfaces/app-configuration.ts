interface HolidayConfiguration {
    [key: string]: Array<number>;
    holidays20: Array<number>;
    holidays26: Array<number>;
}

interface HolidayRequestConfiguration {
    [key: string]: Array<string>;
}

export default interface AppConfiguration {
    holidayConfig: HolidayConfiguration;
    dbConnectionString: string;
    mainDbName: string;
    schedulingDbName: string;
    hostingPort: string;
    holidayRequestTransitions: HolidayRequestConfiguration;
}
