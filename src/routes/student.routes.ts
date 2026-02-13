import { Router } from "express";
import { authorize } from "../middleware/authorize";
import { authenticate } from "../middleware/auth";
import { Role } from '../generated/prisma/client';
import { deleteStudent, editStudent, registerStudent } from "../controllers/student.controller";
import { upload } from "../controllers/file.controller";

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
router.delete('/:id', authenticate, authorize(Role.admin, Role.coach), deleteStudent);

/**
 * @openapi
 * /api/student/add:
 *    post:
 *      tags: [Student]
 *      summary: Add a new student
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *           schema:
 *            type: object
 *            required:
 *              - avatar
 *              - firstName
 *              - lastName
 *              - dateOfBirth
 *              - phoneNumber
 *              - coachId
 *              - discipline
 *            properties:
 *              avatar:
 *                type: string
 *                format: binary
 *                description: Image to upload
 *              firstName:
 *                type: string
 *                description: First name of student
 *              lastName:
 *                type: string
 *                description: Last name of student
 *              dateOfBirth:
 *                type: string
 *                description: Student's date of birth (DD-MM-YYYY)
 *              phoneNumber:
 *                type: string
 *                description: Student's phone number
 *              coachId:
 *                type: integer
 *                description: Id of coach
 *              discipline:
 *                type: string
 *                description: Student's discipline
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
router.post("/add",
            authenticate, authorize(Role.admin, Role.coach), upload.single("avatar"),
            registerStudent);

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
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *                description: Image to upload
 *              firstName:
 *                type: string
 *                description: New student's first name
 *              lastName:
 *                type: string
 *                description: New student's last name
 *              phoneNumber:
 *                type: string
 *                description: New student's phone number
 *              discipline:
 *                type: string
 *                description: New student's discipline
 *              dateOfBirth:
 *                type: string
 *                description: New student's date of birth (DD-MM-YYYY)
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
router.patch("/:id",
             authenticate, authorize(Role.admin, Role.coach), upload.single("avatar"),
             editStudent);

export default router;
