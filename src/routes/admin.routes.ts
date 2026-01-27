import { Router } from 'express';
import { addEvent, deleteCoach, deleteStudent, editCoach, editEvent } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { Role } from '../generated/prisma/client';
const router = Router();

/**
 * @openapi
 * /admin/coaches/{coachId}:
 *   patch:
 *     summary: Update coach data
 *     tags: [Admin]
 *     parameters:
 *      - name: coachId
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *     requestBody:
 *      required: false 
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: newusername
 *              password:
 *                type: string
 *                example: newpass123
 *                description: Only if changing password
 *              firstName:
 *                type: string
 *                example: John
 *              lastName:
 *                type: string
 *                example: Doe
 *              phoneNumber:
 *                type: string
 *                example: +71234567890
 *              imgId:
 *                type: integer
 *              image:
 *                $ref: '#/components/schemas/ImageUpload'
 *                description: Must be obtained from /
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: SUCCESS
 *              message: "Coach updated successfully"
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: BAD_REQUEST
 *              message: "Username is required"
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
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: NOT_FOUND
 *              message: "User with this ID not exists"
 *              details: []
 */
router.patch('/coaches/:id', authenticate, authorize(Role.admin), editCoach);

/**
 * @openapi
 * /admin/event/{eventId}:
 *   patch:
 *     summary: Update event data
 *     tags:
 *       [Admin]
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
 * /admin/event/add:
 *   post:
 *     summary: Add Event 
 *     tags:
 *      [Admin]
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
router.post('/event/add', authenticate, authorize(Role.admin), addEvent);

/**
 * @openapi
 * /admin/coach/{coachId}:
 *   delete:
 *     summary: Delete coach data
 *     tags:
 *      [Admin]
 *     parameters:
 *       - name: coachId
 *         in: path
 *         required: true
 *         description: Id of coach to delete
 *     responses:
 *       200:
 *         description: Success 
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: SUCCESS
 *              message: "Coach deleted successfully"
 *       404:
 *         description: Not found 
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: NOT_FOUND 
 *              message: "Coach with this id not exists"
 *              details: []
 *       401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiResponse'
 *              example:
 *                code: UNAUTHORIZED
 *                message: "Authnticate token is missing or invalid"
 *                details: []
 *       403:
 *          description: Forbidden
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiResponse'
 *              example:
 *                code: FORBIDDEN
 *                message: "You're not allowd to use this route"
 *                details: []
 */
router.delete('/coach/:id', authenticate, authorize(Role.admin), deleteCoach);

/**
 * @openapi
 * /admin/student/{studentId}:
 *   delete:
 *     summary: delete student data
 *     tags:
 *      [Admin]
 *     parameters:
 *       - name: studentId
 *         in: path
 *         required: true
 *         description: ID of student to delete
 *     responses:
 *       200:
 *         description: Success 
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: SUCCESS
 *              message: "Sutdent deleted successfully"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: NOT_FOUND
 *              message: "Student with this ID is not exists"
 *              details: []
 *       401:
 *         description: Unauthorized
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiResponse'
 *              example:
 *                code: UNAUTHORIZED 
 *                message: "Authnticate token is missing or invalid"
 *                details: []
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
router.delete('/student/:id', authenticate, authorize(Role.admin, Role.coach), deleteStudent);

export default router;
