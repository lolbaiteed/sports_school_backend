import { Router } from "express";
import { login, register, logout, registerStudent } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { Role } from "../generated/prisma/client";

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *  post:
 *    tags: [Admin, Auth]
 *    responses:
 *      201:
 *       description: Created 
 */

router.post("/register", authenticate, authorize(Role.admin), register);

/**
 * @openapi
 * /api/auth/student/register:
 *    post:
 *      tags: [Admin, Auth]
 *      responses:
 *        201:
 *          description: Created
 */        
router.post("/student/register", authenticate, authorize(Role.admin, Role.coach), registerStudent);

/**
 * @openapi
 * /api/auth/login:
 *  post:
 *    tags: [Auth]
 *    security: []
 *    responses:
 *      200:
 *        description: logged in
 */
router.post("/login", login);

/**
 * @openapi
 * /api/auth/logout:
 *  post:
 *    tags: [Auth]
 *    security: []
 *    responses:
 *      200:
 *        description: logged out
 */
router.post("/logout", logout);

export default router;
