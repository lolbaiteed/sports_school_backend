import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { hashPassword, verifyPassword } from "../services/auth.service";
import { signAccessToken } from "../utils/jwt";
import { Role } from "../generated/prisma/client";

/**
 * ADMIN ONLY
 */
export const register = async(req: Request, res: Response) => {
  const {
    username,
    email,
    password,
    role,
    firstName,
    lastName,
  } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (!Object.values(Role).includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName
    },
  });

  res.status(201).json({
    id: user.id,
    email: user.email,
    role: user.role,
  });
};

/**
 * PUBLIC
 */
export const login = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await verifyPassword(password, user.password);

  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signAccessToken(user.id, user.role);

  res.json({
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
};
