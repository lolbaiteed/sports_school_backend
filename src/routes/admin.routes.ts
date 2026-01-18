import { Router } from 'express';
import { addEvent, deleteCoach, deleteStudent, editCoach, editEvent } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { Role } from '../generated/prisma/client';
const router = Router();

router.patch('/CoachUpdate', authenticate, authorize(Role.admin), editCoach);
router.patch('/eventUpdate', authenticate, authorize(Role.admin, Role.coach), editEvent);
router.post('/addEvent', authenticate, authorize(Role.admin), addEvent);
router.delete('/deleteCoach', authenticate, authorize(Role.admin), deleteCoach);
router.delete('/deleteStudent', authenticate, authorize(Role.admin, Role.coach), deleteStudent);

export default router;
