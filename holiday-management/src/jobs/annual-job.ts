import { getLogger } from 'log4js';

import { HolidayService } from './../business-logic/holiday-service';
import HolidayContainer from '../models/holiday-container';
import HolidayContainerRow from '../models/holiday-container-row';

const holidayService = new HolidayService();
const log = getLogger('AnnualJob');

export async function execute(): Promise<void> {
    log.info('Started execution');

    try {
        const currentYear = new Date().getFullYear();
        const pastYear = currentYear - 1;

        let containers = await holidayService.getAllHolidayContainers(pastYear).catch(err => { throw err; });
        for (let i = 0; i < containers.length; i++) {
            let oldContainer = containers[i];
            let newContainer = new HolidayContainer(null, oldContainer.userId, oldContainer.holidaysPerYear, oldContainer.startDate, currentYear);
            oldContainer.isActive = false;
            var normalCategory = oldContainer.categories.find(c => c.category === 'holidayNormal');

            for (let j = 0; j < oldContainer.categories.length; j++) {
                var category = oldContainer.categories[j];
                var available =
                    category.category === 'holidayFromPrevYear' ? normalCategory.sum
                        : category.category === 'holidayOnRequest' ? 4
                            : 0;

                var newCategory = new HolidayContainerRow(category.category, available, 0, available);
                newContainer.categories.push(newCategory);
            }

            await holidayService.updateHolidayContainer(oldContainer).catch(err => { throw err; });
            await holidayService.createHolidayContainer(newContainer).catch(err => { throw err; });
            log.info(`Old user container ${newContainer.userId} for year ${pastYear} deactivated and created new one - ${currentYear}`);
        }

        let activeHolidayRequests = await holidayService.getHolidayRequests().catch(err => { throw err; });
        for (var k = 0; k < activeHolidayRequests.length; k++) {
            activeHolidayRequests[k].isActive = false;
            await holidayService.updateHolidayRequest(activeHolidayRequests[k]).catch(err => { throw err; });
        }
    } catch (err) {
        log.error(`Error: ${err}`);
    }

    log.info('Finished execution');
}
