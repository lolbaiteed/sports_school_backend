import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { Role } from "../generated/prisma/client";

const router = Router();

router.post("/register", authenticate, authorize(Role.admin), register);

router.post("/login", login);

export default router;
