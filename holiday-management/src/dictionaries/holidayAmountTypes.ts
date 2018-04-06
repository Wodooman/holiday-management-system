import HolidayAmountType from './../models/holiday-amount-type';

export default function(): HolidayAmountType[] {
    return [
        new HolidayAmountType('holidays20', '20'),
        new HolidayAmountType('holidays26', '26')
    ];
}
