import * as Agenda from 'agenda';
import * as config from 'config';
import AppConfiguration from '../interfaces/app-configuration';
import * as AnnualJob from '../jobs/annual-job';
import * as MonthlyJob from '../jobs/monthly-job';

const appConfig = config.get('Config') as AppConfiguration;

const agendaInstance = new Agenda({ db: { address: `${appConfig.dbConnectionString}/${appConfig.schedulingDbName}` } });

export function initScheduler(): void {
    try {
        agendaInstance.cancel({}, ); // Clear all jobs
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

    agendaInstance.on('ready', () => {
        // Note: in agenda v <= 0.9.1 there is known issue - months counted from 0 (not from 1 like it is in cron standard)
        agendaInstance.every('0 0 1 0 *', 'annually job');
        agendaInstance.every('0 0 1 * *', 'monthly job');

        agendaInstance.start();
    });
}
