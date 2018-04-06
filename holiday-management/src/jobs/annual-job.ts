import { HolidayService } from './../business-logic/holiday-service';
import HolidayContainer from '../models/holiday-container';
import HolidayContainerRow from '../models/holiday-container-row';
import * as config from 'config';
const holidayService = new HolidayService();

export async function execute(): Promise<void> {
    const currentYear = new Date().getFullYear();
    const pastYear = currentYear - 1;

    let containers = await holidayService.getAllHolidayContainers(pastYear);
    for (let i = 0; i < containers.length; i++) {
        let oldContainer = containers[i];
        let newContainer = new HolidayContainer(oldContainer.userId, oldContainer.holidaysPerYear, oldContainer.startDate, currentYear);
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

        await holidayService.updateHolidayContainer(oldContainer);
        await holidayService.createHolidayContainer(newContainer);
    }

    let activeHolidayRequests = await holidayService.getHolidayRequests();
    for (var k = 0; k < activeHolidayRequests.length; k++) {
        activeHolidayRequests[k].isActive = false;
        await holidayService.updateHolidayRequest(activeHolidayRequests[k]);
    }
}
