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
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *             file:
 *               type: string
 *               format: binary
 *               description: Image to upload
 *             username:
 *               type: string
 *               description: New coach username 
 *             password:
 *               type: string
 *               description: New coach password
 *             firstName:
 *               type: string
 *               description: New coach first name 
 *             lastName:
 *               type: string
 *               description: New coach last name
 *             role:
 *               type: string
 *               description: New coach role (admin, coach)
 *             discipline:
 *               type: string
 *               description: New coach discipline
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
router.patch('/:id', authenticate, authorize(Role.admin), upload.single("avatar"), editCoach);

/**
  @openapi
 * /api/coach/add:
 *  post:
 *   summary: Add a new coach 
 *   tags: [Coach]
 *   requestBody:
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *        type: object
 *        required:
 *         - file
 *         - username
 *         - password
 *         - phoneNumber
 *         - role
 *         - firstName
 *         - lastName
 *         - discipline
 *        properties:
 *         file:
 *          type: string
 *          format: binary
 *          description: image to upload
 *         username:
 *          type: string
 *          description: Coach username 
 *         password:
 *          type: string
 *          description: Coach password 
 *         phoneNumber:
 *          type: string
 *          description: Coach phone number (712345678980) 
 *         role:
 *          type: string
 *          description: Role (Coach, admin) 
 *         firstName:
 *          type: string
 *          description: Coach first name 
 *         lastName:
 *          type: string
 *          description: Coach last name 
 *         discipline:
 *          type: string
 *          description: Discipline 
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
router.post('/add', authenticate, authorize(Role.admin), upload.single("avatar"), addCoach);

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
router.delete('/:id', authenticate, authorize(Role.admin), deleteCoach);

export default router; 
