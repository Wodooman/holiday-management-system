import * as Agenda from 'agenda';
import * as MonthlyJob from '../jobs/monthly-job';
import * as AnnualJob from '../jobs/annual-job';
import * as config from 'config';
import AppConfiguration from '../interfaces/app-configuration';

const appConfig = config.get('Config') as AppConfiguration;

const agendaInstance = new Agenda({ db: { address: `${appConfig.dbConnectionString}/${appConfig.schedulingDbName}` } });

export function initScheduler(): void {
    try {
        agendaInstance.cancel({}, ); //Clear all jobs
    } catch (err) {
        // Note: error thrown on empty collection
    }

    agendaInstance.define('monthly job', (job, done) => {
        MonthlyJob.execute();
        done();
    });

    agendaInstance.define('annually job', (job, done) => {
        AnnualJob.execute();
        done();
    });

    agendaInstance.on('ready', function () {
        agendaInstance.every('0 0 1 1 *', 'annually job');
        agendaInstance.every('0 0 1 * *', 'monthly job');

        agendaInstance.start();
    });
}
