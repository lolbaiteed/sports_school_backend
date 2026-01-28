import { Router } from "express";
import { authorize } from "../middleware/authorize";
import { authenticate } from "../middleware/auth";
import { Role } from '../generated/prisma/client';
import { deleteStudent, registerStudent } from "../controllers/student.controller";

const router = Router();

/**
 * @openapi
 * /api/student/{studentId}:
 *   delete:
 *     summary: delete student data
 *     tags:
 *      [Student]
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

/**
 * @openapi
 * /api/student/add:
 *    post:
 *      tags: [Student]
 *      responses:
 *        201:
 *          description: Created
 */        
router.post("/student/add", authenticate, authorize(Role.admin, Role.coach), registerStudent);

export default router;
