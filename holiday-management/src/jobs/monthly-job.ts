import * as config from 'config';
import { getLogger } from 'log4js';

import { HolidayService } from './../business-logic/holiday-service';
import HolidayContainer from '../models/holiday-container';
import AppConfiguration from '../interfaces/app-configuration';

const holidayService = new HolidayService();
const appConfig = config.get('Config') as AppConfiguration;
const log = getLogger('MonthlyJob');

export async function execute(): Promise<void> {
    log.info('Started execution');

    try {
        let containers = await holidayService.getAllHolidayContainers().catch(err => { throw err; });
        var today = new Date();
        const currentMonth = today.getMonth();

        for (let i = 0; i < containers.length; i++) {
            var container = containers[i];
            var normalHolidays = container.categories.find(c => c.category === 'holidayNormal');

            var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const startWorking = container.startDate <= todayDate;

            const firstMonth = new Date(container.startDate);
            firstMonth.setMonth(firstMonth.getMonth() + 1);
            const isFirstMonth = container.startDate <= today && today <= firstMonth;

            if (startWorking && (!isFirstMonth || container.isFirstMonthCounted)) {
                var daysToAdd = appConfig.holidayConfig.holdiayDays[container.holidaysPerYear][currentMonth];
                normalHolidays.available += daysToAdd;
                normalHolidays.sum += daysToAdd;
                await holidayService.updateHolidayContainer(container).catch(err => { throw err; });
                log.info(`User container ${container.userId} got ${daysToAdd} normal days`);
            } else {
                log.info(`User container ${container.userId} wasn't updated`);
            }
        }
    } catch (err) {
        log.error(`Error: ${err}`);
    }

    log.info('Finished execution');
}