import { Router } from "express";
import { authorize } from "../middleware/authorize";
import { authenticate } from "../middleware/auth";
import { Role } from '../generated/prisma/client';
import { deleteStudent, editStudent, registerStudent } from "../controllers/student.controller";

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
 *      summary: Add a new student
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                phoneNumber:
 *                  type: string
 *                  description: Phone number of student
 *                  example: 71234567890
 *                  required: true
 *                lastName:
 *                  type: string
 *                  description: Last name of student
 *                  example: Doe
 *                  required: true
 *                fistName:
 *                  type: string
 *                  description: First name of student
 *                  example: John
 *                  required: true
 *                dateOfBirth:
 *                  type: string
 *                  example: 12-01-2011
 *                  description: Student's date of birth
 *                image:
 *                  $ref: '#/components/schemas/ImageUpload'
 *                  description: Must be obtained from /
 *      responses:
 *        201:
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiResponse'
 *              example:
 *                code: CREATED
 *                message: "Student created successfully"
 *        400:
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiResponse'
 *              example:
 *                code: BAD_REQUEST
 *                message: Phone number cannot be empty/null
 *                details: []
 *        401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiResponse'
 *              example:
 *                code: UNAUTHORIZED
 *                message: Authnticate token is missing or invalid
 *                details: []
 *        403:
 *          description: Forbidden
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiResponse'
 *              example:
 *                code: FORBIDDEN
 *                message: You're not allowed to use this route
 *                details: []
 *        409:
 *          description: Conflict
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiResponse'
 *              example:
 *                code: CONFILICT
 *                message: Student with this phone number already exists
 *                details: []
 */        
router.post("/student/add", authenticate, authorize(Role.admin, Role.coach), registerStudent);

/**
 * @openapi
 *  /api/student/{studentId}:
 *   patch:
 *    summary: Update student's data 
 *    tags: [Student]
 *    parameters:
 *      - name: studentId
 *        in: path
 *        required: true
 *        description: Id of student to edit
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              phoneNumber:
 *                type: string
 *                description: Phone number of student
 *                example: 71234567890
 *              firstName:
 *                type: string
 *                description: First name of student
 *                example: John
 *              lastName:
 *                type: string
 *                description: Last name of student
 *                example: Doe
 *              dateOfBirth:
 *                type: string
 *                description: Student's date of birth
 *                example: 12-01-2011
 *              image:
 *                $ref: '#/components/schemas/ImageUpload'
 *                description: Must be obtained from /
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: SUCCESS
 *              message: Student updated successfully
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: BAD_REQUEST
 *              message: Student Id must be a number
 *              details: []
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: UNAUTHORIZED
 *              message: Authnticate token is missing or invalid
 *              details: []
 *      403:
 *        description: Forbidden
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: FORBIDDEN
 *              message: You're not allowed to use this route
 *              details: []
 *      404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: NOT_FOUND
 *              message: Student with this ID not exists
 *              details: []
 */
router.patch("/student/:id", authenticate, authorize(Role.admin, Role.coach), editStudent);

export default router;
