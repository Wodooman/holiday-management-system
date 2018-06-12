import * as express from 'express';
import { Request, Response } from 'express-serve-static-core';
import * as AnnualJob from '../jobs/annual-job';
import * as MonthlyJob from '../jobs/monthly-job';
import { HolidayService } from './../business-logic/holiday-service';

const router = express.Router();
const holidayService = new HolidayService();

/**
 * @swagger
 * definitions:
 *   HolidayContainerRow:
 *     properties:
 *       category:
 *         type: string
 *       available:
 *         type: number
 *       taken:
 *         type: number
 *       sum:
 *         type: number
 *   HolidayContainer:
 *     properties:
 *       userId:
 *         type: number
 *       year:
 *         type: number
 *       categories:
 *         type: array
 *         items:
 *         - $ref: '#/definitions/HolidayContainerRow'
 *   HolidayRequest:
 *     properties:
 *       _id:
 *         type: string
 *       userId:
 *         type: number
 *       startDate:
 *         type: string
 *         format: date
 *       endDate:
 *         type: string
 *         format: date
 *       days:
 *         type: number
 *       type:
 *         type: string
 *       comment:
 *         type: string
 *       creationDate:
 *         type: string
 *         format: date
 *   HolidayUpdate:
 *     properties:
 *       userId:
 *         type: number
 *       leftHolidays:
 *         type: number
 *       comment:
 *         type: string
 */

 /**
 * @swagger
 * /api/test:
 *   get:
 *     tags:
 *       - Test
 *     description: Test API for checking connection to DB
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: DB is not accessible
 */
router.get('/api/test', (req: Request, res: Response, next: express.NextFunction) => {
  holidayService.testConnection()
    .then((val) => {
      res.send(val);
    })
    .catch((err) => {
      return next(err);
    });
});

/**
 * @swagger
 * /api/test/monthly-job:
 *   get:
 *     tags:
 *       - Test
 *     description: Starts monthly job
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Job started successfully
 *       500:
 *         description: Internal error
 */
router.get('/api/test/monthly-job', async (req: Request, res: Response, next: express.NextFunction) => {
    MonthlyJob.execute()
        .then(() => res.send('Success'))
        .catch((err) => {
          return next(err);
        });
});

/**
 * @swagger
 * /api/test/annually-job:
 *   get:
 *     tags:
 *       - Test
 *     description: Starts annually job
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Job started successfully
 *       500:
 *         description: Internal error
 */
router.get('/api/test/annually-job', async (req: Request, res: Response, next: express.NextFunction) => {
    AnnualJob.execute()
        .then(() => res.send('Success'))
        .catch((err) => {
          return next(err);
        });

});

export { router };