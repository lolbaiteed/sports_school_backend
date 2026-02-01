import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { Role } from '../generated/prisma/client';
import { editCoach, deleteCoach, addCoach } from "../controllers/coach.controller";
import { upload } from "../controllers/file.controller";

const router = Router();

/**
 * @openapi
 * /api/coach/{coachId}:
 *   patch:
 *     summary: Update coach data
 *     tags: [Coach]
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
router.patch('/coach/:id', authenticate, authorize(Role.admin), upload.single("avatar"), editCoach);

/**
 * @openapi
 * /api/coach/add:
 *  post:
 *   summary: Add a new coach 
 *   tags: [Coach]
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *         type: object
 *         properties:
 *          username:
 *            type: string
 *            required: true
 *            example: newUser123
 *          password:
 *            type: string
 *            required: true
 *            example: newPass123
 *          phoneNumber:
 *            type: string
 *            required: true
 *            example: 71234567890
 *          role:
 *            type: string
 *            required: true
 *            example: coach
 *          firstName:
 *            type: string
 *            required: true
 *            example: John
 *          lastName:
 *            type: string
 *            required: true
 *            example: Doe
 *          image:
 *            $ref: '#/components/schemas/ImageUpload'
 *
 *   responses:
 *     200:
 *       description: Coach added successfully 
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ApiResponse'
 *          example:
 *            code: SUCCESS
 *            message: Coach added successfully
 *     400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: BAD_REQUEST
 *              message: username is required
 *              details: []
 *     401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: UNAUTHORIZED
 *              message: "Authnticate token is missing or invalid"
 *              details: []
 *     403:
 *        description: Forbidden
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              cdoe: FORBIDDEN
 *              message: "You're not allowd to use this route"
 *              details: []
 *     409:
 *        description: Conflict
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *            example:
 *              code: CONFILICT
 *              message: "Coach with this username already exists"
 *              details: []
 */
router.post('/coach/add', authenticate, authorize(Role.admin), upload.single("avatar"), addCoach);

/**
 * @openapi
 * /api/coach/{coachId}:
 *   delete:
 *     summary: Delete coach data
 *     tags:
 *      [Coach]
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

export default router; 
