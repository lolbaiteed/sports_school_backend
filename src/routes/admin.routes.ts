import { Router } from 'express';
import { addEvent, deleteCoach, deleteStudent, editCoach, editEvent } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { Role } from '../generated/prisma/client';
const router = Router();

/**
 * @swagger
 * /admin/coaches/{coachId}:
 *   patch:
 *     summary: Update coach data
 *     tags: [Admin]
 *     parameters:
 *      name: coachId
 *      in: path
 *      required: true
 *      schema: { type: integer }
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username: {type: string, example: newusername}
 *              password: {type: string, example: newpass123, description: Only if changing password}
 *              firstName: {type: string}
 *              lastName: {type: string}
 *              phoneNumber: {type: string, example: +71234567890}
 *              imgId: {type: integer}
 *              image: {$ref: '#/components/schemas/ImageUpload'}
 *     responses:
 *      '200': {description: Coach updated}
 *      '400': {$ref: "#/components/responses/BadRequest"}
 *      '401': {$ref: '#/components/responses/Unauthorized'}
 */
router.patch('/coaches/:id', authenticate, authorize(Role.admin), editCoach);

/**
 * @openapi
 * /admin/EventUpdate:
 *   patch:
 *     summary: Update event data
 *     tags:
 *       - Admin 
 *     requestBody:
 *        $ref: '#/components/CoachUpdate'
 *     responses:
 *       200:
 *         description: Event updated successfully
 */
router.patch('/eventUpdate', authenticate, authorize(Role.admin, Role.coach), editEvent);

/**
 * @openapi
 * /admin/addEvent:
 *   patch:
 *     summary: Add Event 
 *     tags:
 *       - Admin 
 *     responses:
 *       200:
 *         description: Event added successfully
 *       401:
 *         $ref: '#/components/Unauthorized'
 */
router.post('/addEvent', authenticate, authorize(Role.admin), addEvent);

/**
 * @openapi
 * /admin/deleteCoach:
 *   patch:
 *     summary: Delete coach data
 *     tags:
 *       - Admin 
 *     responses:
 *       200:
 *         description: Coach deleted successfully
 */
router.delete('/deleteCoach', authenticate, authorize(Role.admin), deleteCoach);

/**
 * @openapi
 * /admin/deleteCoach:
 *   patch:
 *     summary: Update coach data
 *     tags:
 *       - Admin 
 *     responses:
 *       200:
 *         description: Coach updated successfully
 */
router.delete('/deleteStudent', authenticate, authorize(Role.admin, Role.coach), deleteStudent);

export default router;
