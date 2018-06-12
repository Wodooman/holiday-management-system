interface HolidayDaysConfiguration {
    [key: string]: number[];
    holidays20: number[];
    holidays26: number[];
}

interface HolidayRequestConfiguration {
    [key: string]: string[];
}

interface HolidayConfiguration {
    holdiayDays: HolidayDaysConfiguration;
    holidayRequestTransitions: HolidayRequestConfiguration;
}

export default interface AppConfiguration {
    holidayConfig: HolidayConfiguration;
    dbConnectionString: string;
    mainDbName: string;
    schedulingDbName: string;
    hostingPort: string;
}
