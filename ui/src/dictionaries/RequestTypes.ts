import RequestType from './../models/RequestType';

export default function(): RequestType[] {
    return [
        new RequestType('holidayNormal', 'Holiday - Normal'),
        new RequestType('holidayFromPrevYear', 'Holiday - From Previous Year'),
        new RequestType('holidayOnRequest', 'Holiday - On Request'),
        new RequestType('holidayNotPaid', 'Holiday - Not Paid'),
        new RequestType('holidayOther', 'Holiday - Other'),
        new RequestType('forOverTimes', 'For Overtimes'),
        new RequestType('sickLeave', 'Sick-leave')
    ];
}
