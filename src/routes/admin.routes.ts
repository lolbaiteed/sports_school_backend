import { Router } from 'express';
import { addEvent, deleteCoach, deleteStudent, editCoach, editEvent } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { Role } from '../generated/prisma/client';
const router = Router();

/**
 * @swagger
 * /admin/CoachUpdate:
 *   patch:
 *     tags:
 *      - Admin
 *     summary: Update coach data 
 *     requestBody:
 *        $ref: '#/components/CoachUpdate'
 *     responses:
 *       200:
 *         description: Coach updated successfully
 *       400:
 *         $ref '#/components/BadRequest'
 *       401:
 *         $ref '#/components/Unauthorized'
 */
router.patch('/CoachUpdate', authenticate, authorize(Role.admin), editCoach);

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
