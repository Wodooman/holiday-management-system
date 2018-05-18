import HolidayRequestStatus from './../models/HolidayRequestStatus';

let statusesIds = {
    waitingForApprove: 'waitingForApprove',
    approved: 'approved',
    rejected: 'rejected',
    cancelledByUser: 'cancelledByUser'
};

export function getStatuses(): HolidayRequestStatus[] {
    return [
        new HolidayRequestStatus(statusesIds.waitingForApprove, 'Waiting for approval'),
        new HolidayRequestStatus(statusesIds.approved, 'Approved'),
        new HolidayRequestStatus(statusesIds.rejected, 'Rejected'),
        new HolidayRequestStatus(statusesIds.cancelledByUser, 'Cancelled by user')
    ];
}

export let StatusesIds = statusesIds;