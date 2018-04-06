import HolidayAmountType from './../models/HolidayAmountType';

export default function(): HolidayAmountType[] {
    return [
        new HolidayAmountType('holidays20', '20'),
        new HolidayAmountType('holidays26', '26')
    ];
}
