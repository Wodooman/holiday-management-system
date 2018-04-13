import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as config from 'config';
import { configure, getLogger, connectLogger } from 'log4js';

import { router as holidays } from './controllers/holiday-controller';
import ResponseError from './models/response-error';
import { router as testController } from './controllers/test-controller';
import * as Scheduler from './services/scheduler';
import AppConfiguration from './interfaces/app-configuration';
import * as Middlewares from './services/middlewares';

const appConfig = config.get('Config') as AppConfiguration;
configure('./config/log4js.json');
const log = getLogger('App');

const app = express();

Scheduler.initScheduler();

app.use(connectLogger(getLogger('http'), { level: 'auto' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', holidays);
app.use('/', testController);

Middlewares.registerSwagger(app);

if (app.get('env') === 'development') {
  app.use(function (err: ResponseError, req: express.Request, res: express.Response, next: express.NextFunction) {
    log.error('Something went wrong:', err);
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err: ResponseError, req: express.Request, res: express.Response, next: express.NextFunction) {
  log.error('Something went wrong:', err);
  res.status(err.status || 500);
  res.json({
    error: err.message,
  });
});

app.listen(appConfig.hostingPort);
