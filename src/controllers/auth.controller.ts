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
    password,
    reqRole,
    firstName,
    lastName,
  } = req.body;

  if (!username || !password || !reqRole) {
    return res.status(400).json({ message: "Missing fields" });
  }

  function isValidRole(role: unknown): role is Role {
    return Object.values(Role).includes(role as Role);
  }

  const existingUser = await prisma.user.findFirst({
    where: { username: username },
  });

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await hashPassword(password);

  if (!isValidRole(reqRole)) {
    return res.status(400).json({ message: 'Invalid role value' });
  };

  const user = await prisma.user.create({
    data: {
      username: username, 
      password: hashedPassword,
      role: reqRole,
      firstName: firstName ?? null, 
      lastName: lastName ?? null, 
    },
  });

  if (user)

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

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  const user = await prisma.user.findFirst({
    where: { username: username },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await verifyPassword(password, user.password);

  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signAccessToken(user.id, user.role);

  res.status(200).json({
    accessToken: token,
    user: {
      id: user.id,
      username: user.username,
    },
  });
};
