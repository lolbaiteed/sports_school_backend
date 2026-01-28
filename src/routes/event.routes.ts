import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { Role } from '../generated/prisma/client';
import { editEvent, addEvent } from '../controllers/event.controller';

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
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *             eventName:
 *              type: string
 *              description: The name of event
 *              example: Olympic games
 *             latitude:
 *              type: number 
 *              description: coordinats of event place
 *             longitude:
 *              type: number
 *              description: coordinats of event place
 *             startDate:
 *              type: string
 *              description: Event start date
 *             endDate:
 *              type: string
 *              description: Event end date
 *             image:
 *               $ref: '#/components/schemas/ImageUpload'
 *               description: Must be obtained from /
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
router.patch('/event/:id', authenticate, authorize(Role.admin, Role.coach), editEvent);

/**
 * @openapi
 * /api/event/add:
 *   post:
 *     summary: Add Event 
 *     tags:
 *      [Event]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              eventName:
 *                type: string
 *                required: true
 *                description: Event name
 *                example: Olympic games
 *              latitude:
 *                type: float
 *                required: true
 *                description: Latitude, must be in float (77.001054)
 *              longitude:
 *                type: float
 *                required: true
 *                description: Longitude, must be in float (43.382877)
 *              startDate:
 *                type: date 
 *                required: true
 *                description: Event start date (DD-MM-YYYY)
 *              endDate:
 *                type: date
 *                required: true
 *                description: Event end date (DD-MM-YYYY)
 *              image:
 *                $ref: '#/components/schemas/ImageUpload'
 *                description: Must be obtained from /
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
 *
 */
router.post('/event/add', authenticate, authorize(Role.admin, Role.coach), addEvent);

export default router;
