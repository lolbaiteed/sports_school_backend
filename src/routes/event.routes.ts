import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { Role } from '../generated/prisma/client';
import { editEvent, addEvent, deleteEvent } from '../controllers/event.controller';
import { upload } from '../controllers/file.controller';

const router = Router();

/**
 * @openapi
 * /api/event/{eventId}:
 *   patch:
 *     summary: Update event data
 *     tags:
 *       [Event]
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *          type: integer
 *     requestBody:
 *      required: false 
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              eventName:
 *                type: string
 *                description: New name of event
 *              latitude:
 *                type: number
 *                description: New latitude of event
 *              longitude:
 *                type: number
 *                description: New longitude of event
 *              startDate:
 *                type: string
 *                description: New event start date
 *              endDate:
 *                type: string 
 *                description: New event end date
 *              eventImage:
 *                type: string
 *                format: binary
 *                description: New images from event
 *     responses:
 *       200:
 *         description: Success 
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: SUCCESS
 *              message: "Event updated successfully"
 *       400:
 *         description: Bad Request
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: BAD_REQUEST
 *              message: "Username is required"
 *              details: []
 *       401:
 *         description: Unauthorized
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: UNAUTHORIZED
 *              message: "Authnticate token is missing or invalid"
 *              details: []
 *       404:
 *         description: Not Found
 *         content:
 *          applicatin/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: NOT_FOUND
 *              message: "User with this ID not exists"
 *              details: []
 */
router.patch('/:id',
             authenticate, authorize(Role.admin, Role.coach), upload.array("eventPhoto", 5),
             editEvent);

/**
 * @openapi
 * /api/event/add:
 *   post:
 *     summary: Add Event 
 *     tags:
 *      [Event]
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - longitude
 *              - latitude
 *              - eventName
 *              - startDate
 *              - endDate
 *            properties:
 *              eventName:
 *                type: string
 *                description: Event name
 *              latitude:
 *                type: number
 *                description: Event latitude
 *              longitude:
 *                type: number 
 *                description: Event longitude
 *              startDate:
 *                type: string
 *                description: Event start date (DD-MM-YYYY)
 *              endDate:
 *                type: string
 *                description: Event end date (DD-MM-YYYY)
 *              eventImage:
 *                type: string
 *                format: binary
 *                description: Event images
 *     responses:
 *       200:
 *         description: Success 
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: SUCCESS
 *              message: "Event added successfully"
 *       400:
 *         description: Bad Request
 *         content:
 *          applicatin/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: BAD_REQUEST
 *              message: "Username is required"
 *              details: []
 *       401:
 *         description: Unauthorized
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: UNAUTHORIZED
 *              message: "Authnticate token is missing or invalid"
 *              details: []
 *       403:
 *          description: Forbidden
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiResponse'
 *              example:
 *                code: FORBIDDEN
 *                message: "You're not allowed to use this route"
 *                details: []
 */
router.post('/add',
            authenticate, authorize(Role.admin, Role.coach), upload.array("eventPhoto", 5),
            addEvent);

/**
 * @openapi
 *  /api/event/{eventId}:
 *   delete:
 *    summary: Delete event
 *    tags: 
 *      [Event]
 *    parameters:
 *      - name: eventId
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: SUCCESS
 *              message: Event deleted successfully
 *      404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: NOT_FOUND
 *              message: "Event is not exists"
 *              details: []
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: UNAUTHORIZED
 *              message: "Authnticate token is missing or invalid"
 *              details: []
 *      403:
 *        description: Forbidden
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: FORBIDDEN
 *              message: "You're not allowd to use this route"
 *              details: []
 */
router.delete('/:id', authenticate, authorize(Role.admin), deleteEvent);

export default router;
