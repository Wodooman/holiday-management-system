import * as express from 'express';
import * as path from 'path';
import swaggerJSDoc = require('swagger-jsdoc');
import * as bodyParser from 'body-parser';
import { router as holidays } from './controllers/holiday-controller';
import ResponseError from './models/response-error';
import { router as testController } from './controllers/test-controller';

const app = express();

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Holiday Management Service API',
    version: '1.0.1',
    description: 'A service for management holidays',
  },
  host: 'localhost:3001',
  basePath: '/',
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['dist/controllers/*.js'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', holidays);
app.use('/', testController);

app.get('/swagger.json', function (req: express.Request, res: express.Response) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

if (app.get('env') === 'development') {
  app.use(function(err: ResponseError, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err: ResponseError, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.json({
        error: err.message,
    });
});

app.listen(3001);