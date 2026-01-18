import { Router } from "express";
import { login, register, logout, registerStudent } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { Role } from "../generated/prisma/client";

const router = Router();

router.post("/register", authenticate, authorize(Role.admin), register);

router.post("/registerStudent", authenticate, authorize(Role.admin), registerStudent);

router.post("/login", login);

router.post("/logout", logout);

export default router;
