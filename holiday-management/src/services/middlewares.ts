import swaggerJSDoc = require('swagger-jsdoc');
import { Express } from 'express';
import * as express from 'express';

export function registerSwagger(app: Express) {
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

    app.get('/swagger.json', function (req: express.Request, res: express.Response) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}
