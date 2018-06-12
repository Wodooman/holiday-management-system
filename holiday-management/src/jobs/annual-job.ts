import { getLogger } from 'log4js';

import HolidayContainer from '../models/holiday-container';
import HolidayContainerRow from '../models/holiday-container-row';
import { HolidayService } from './../business-logic/holiday-service';

const holidayService = new HolidayService();
const log = getLogger('AnnualJob');

export async function execute(): Promise<void> {
    log.info('Started execution');

    try {
        const currentYear = new Date().getFullYear();
        const pastYear = currentYear - 1;

        const containers = await holidayService.getAllHolidayContainers(pastYear).catch((err) => { throw err; });
        for (const oldContainer of containers) {
            const newContainer = new HolidayContainer(null, oldContainer.userId, oldContainer.holidaysPerYear, oldContainer.startDate, currentYear);
            oldContainer.isActive = false;
            const normalCategory = oldContainer.categories.find((c) => c.category === 'holidayNormal');

            for (const category of oldContainer.categories) {
                const available =
                    category.category === 'holidayFromPrevYear' ? normalCategory.sum
                        : category.category === 'holidayOnRequest' ? 4
                            : 0;

                const newCategory = new HolidayContainerRow(category.category, available, 0, available);
                newContainer.categories.push(newCategory);
            }

            await holidayService.updateHolidayContainer(oldContainer).catch((err) => { throw err; });
            await holidayService.createHolidayContainer(newContainer).catch((err) => { throw err; });
            log.info(`Old user container ${newContainer.userId} for year ${pastYear} deactivated and created new one - ${currentYear}`);
        }

        const activeHolidayRequests = await holidayService.getHolidayRequests().catch((err) => { throw err; });
        for (const activeHolidayRequest of activeHolidayRequests) {
            activeHolidayRequest.isActive = false;
            await holidayService.updateHolidayRequest(activeHolidayRequest).catch((err) => { throw err; });
        }
    } catch (err) {
        log.error(`Error: ${err}`);
    }

    log.info('Finished execution');
}
