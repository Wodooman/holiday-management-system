import { Express } from 'express';
import * as express from 'express';
import swaggerJSDoc = require('swagger-jsdoc');

export function registerSwagger(app: Express) {
    // swagger definition
    const swaggerDefinition = {
        basePath: '/',
        host: 'localhost:3001',
        info: {
            description: 'A service for management holidays',
            title: 'Holiday Management Service API',
            version: '1.0.1'
        }
    };

    // options for the swagger docs
    const options = {
        // path to the API docs
        apis: ['dist/controllers/*.js'],
        // import swaggerDefinitions
        swaggerDefinition
    };

    // initialize swagger-jsdoc
    const swaggerSpec = swaggerJSDoc(options);

    app.get('/swagger.json', (req: express.Request, res: express.Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}
