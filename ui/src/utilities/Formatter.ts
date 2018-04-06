import RequestTypes from '../dictionaries/RequestTypes';
import HolidayAmountTypes from '../dictionaries/HolidayAmountTypes';

export function formatDate(date: Date | undefined): string {
    try {
        return new Intl.DateTimeFormat('en-GB', { 
            year: 'numeric', 
            month: 'long', 
            day: '2-digit' 
            }).format(date);
    } catch (err) { return ''; } 
}

export function formatBoolean(value: boolean): string {
    return value ? 'Yes' : 'No';
}

export function resolveHolidayType(typeId: string) {
    let type = RequestTypes().find(c => c.id === typeId);
    return type ? type.Name : '';
}

export function resolveHolidayAmountType(typeId: string | undefined) {
    if (!typeId) { return ''; }

    let type = HolidayAmountTypes().find(c => c.id === typeId);
    return type ? type.Name : '';
}