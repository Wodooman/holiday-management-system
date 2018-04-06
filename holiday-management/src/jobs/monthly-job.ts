import { HolidayService } from './../business-logic/holiday-service';
import HolidayContainer from '../models/holiday-container';
import AppConfiguration from '../interfaces/app-configuration';
import * as config from 'config';
const holidayService = new HolidayService();
const holidayConfig = config.get('Holidays') as AppConfiguration;

export async function execute(): Promise<void> {
    let containers = await holidayService.getAllHolidayContainers();
    var today =  new Date();
    const currentMonth = today.getMonth();

    for (let i = 0; i < containers.length; i++) {
        var container = containers[i];
        var normalHolidays = container.categories.find(c => c.category === 'holidayNormal');

        var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startWorking = container.startDate < todayDate;

        const firstMonth = new Date(container.startDate);
        firstMonth.setMonth(firstMonth.getMonth() + 1);
        const isFirstMonth = container.startDate <= today && today <= firstMonth;

        if (startWorking && (!isFirstMonth || container.isFirstMonthCounted)) {
            var daysToAdd = holidayConfig[container.holidaysPerYear][currentMonth];
            normalHolidays.available += daysToAdd;
            await holidayService.updateHolidayContainer(container);
        }
    }
}