import * as express from 'express';
import HolidayUpdate from '../models/holiday-update';
import HolidayContainer from '../models/holiday-container';
import { Request, Response } from 'express-serve-static-core';
import { HolidayService } from './../business-logic/holiday-service';
import ResponseError from '../models/response-error';
import HolidayRequest from '../models/HolidayRequest';

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
 * /api/holidays:
 *   get:
 *     tags:
 *       - Holidays
 *     description: Returns all holiday containers for all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of holidays
 *         schema:
 *           $ref: '#/definitions/HolidayContainer'
 *       500:
 *         description: Internal error
 */
router.get('/api/holidays', (req: Request, res: Response, next: express.NextFunction) => {
  holidayService.getAllHolidayContainers()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      return next(err);
    });
});

/**
 * @swagger
 * /api/holidays:
 *   post:
 *     tags:
 *       - Holidays
 *     description: Creates a new holiday container for a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: holiday
 *         description: Holiday object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/HolidayContainer'
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Container for this user already exists
 *       500:
 *         description: Internal error
 */
router.post('/api/holidays', (req: Request, res: Response, next: express.NextFunction) => {
  let userId = parseInt(req.body.userId, 10);
  holidayService.getHolidayContainer(userId)
    .then(result => {
      if (!result) {
        var container = req.body as HolidayContainer;
        //TODO: replace later. Needed for testing while UI doesn't send it
        container.startDate = new Date();
        container.holidaysPerYear = 'holidays26';
        container.isFirstMonthCounted = true;
        container.isNewEmployee = true;

        holidayService.createHolidayContainer(req.body)
          .then(createdContainer => {
            res.status(201);
            res.send(createdContainer);
          })
          .catch(err => {
            return next(err);
          });
      } else {
        return next(new ResponseError('Container for this user already exists', 400));
      }
    })
    .catch(err => {
      return next(err);
    });
});

/**
 * @swagger
 * /api/holidays/{userId}:
 *   get:
 *     tags:
 *       - Holidays
 *     description: Returns a holiday container for a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: User's id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: A single holiday container
 *         schema:
 *           $ref: '#/definitions/HolidayContainer'
 *       500:
 *         description: Internal error
 */
router.get('/api/holidays/:userId', (req: Request, res: Response, next: express.NextFunction) => {
  holidayService.getHolidayContainer(parseInt(req.params.userId, 10))
    .then(result => res.send(result))
    .catch(err => {
      return next(err);
    });
});

/**
 * @swagger
 * /api/holidayRequests:
 *   get:
 *     tags:
 *       - HolidayRequests
 *     description: Returns all holiday requests
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of holiday requests
 *         schema:
 *           $ref: '#/definitions/HolidayRequest'
 *       500:
 *         description: Internal error
 */
router.get('/api/holidayRequests', (req: Request, res: Response, next: express.NextFunction) => {
  holidayService.getHolidayRequests()
    .then((result: Array<HolidayRequest>) => res.send(result))
    .catch(err => {
      return next(err);
    });
});

/**
 * @swagger
 * /api/holidayRequests:
 *   post:
 *     tags:
 *       - HolidayRequests
 *     description: Creates a new holiday request for a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: holidayRequest
 *         description: HolidayRequest object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/HolidayRequest'
 *     responses:
 *       201:
 *         description: Successfully created
 *       500:
 *         description: Internal error
 */
router.post('/api/holidayRequests', (req: Request, res: Response, next: express.NextFunction) => {
  holidayService.createHolidayRequest(req.body)
    .then(createdContainer => {
      res.status(201);
      res.send(createdContainer);
    })
    .catch(err => {
      return next(err);
    });
});

/**
 * @swagger
 * /api/holidayRequests/{userId}:
 *   get:
 *     tags:
 *       - HolidayRequests
 *     description: Returns all holiday requests for a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: User's id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: An array of holiday requests
 *         schema:
 *           $ref: '#/definitions/HolidayRequest'
 *       500:
 *         description: Internal error
 */
router.get('/api/holidayRequests/:userId', (req: Request, res: Response, next: express.NextFunction) => {
  holidayService.getHolidayRequests(parseInt(req.params.userId, 10))
    .then(result => res.send(result))
    .catch(err => {
      return next(err);
    });
});

/**
 * @swagger
 * /api/holidayUpdates:
 *   post:
 *     tags:
 *       - HolidayUpdates
 *     description: Creates a new holiday update for a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: holidayUpdate
 *         description: HolidayUpdate object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/HolidayUpdate'
 *     responses:
 *       201:
 *         description: Successfully created
 *       500:
 *         description: Internal error
 */
router.post('/api/holidayUpdates', async (req: Request, res: Response, next: express.NextFunction) => {
  const update: HolidayUpdate = {
    leftHolidays: req.body.leftHolidays,
    comment: req.body.comment
  };

  var container = await holidayService.getHolidayContainer(req.body.userId);
  if (container.holidayUpdates) {
    container.holidayUpdates.push(update);
  } else {
    container.holidayUpdates = [update];
  }

  holidayService.updateHolidayContainer(container)
    .then(result => {
      res.status(201);
      res.send(result);
    })
    .catch(err => {
      return next(err);
    });
});

export { router };