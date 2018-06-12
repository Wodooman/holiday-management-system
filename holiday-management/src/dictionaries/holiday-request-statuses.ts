import HolidayRequestStatus from './../models/holiday-request-status';

const statusesIds = {
    approved: 'approved',
    cancelledByUser: 'cancelledByUser',
    rejected: 'rejected',
    waitingForApprove: 'waitingForApprove'
};

export function getStatuses(): HolidayRequestStatus[] {
    return [
        new HolidayRequestStatus(statusesIds.waitingForApprove, 'Waiting for approval'),
        new HolidayRequestStatus(statusesIds.approved, 'Approved'),
        new HolidayRequestStatus(statusesIds.rejected, 'Rejected'),
        new HolidayRequestStatus(statusesIds.cancelledByUser, 'Cancelled by user')
    ];
}

export function getStatusById(id: string): HolidayRequestStatus {
    return this.getStatuses().find((c: HolidayRequestStatus) => c.id === id);
}

export let StatusesIds = statusesIds;