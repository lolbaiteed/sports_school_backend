import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/client";

interface JwtPayload {
  sub: number;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const cookie = req.cookies.access_token;
  try {
    const token = cookie; 

    if (!token) res.redirect('/'); 

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as unknown as JwtPayload;

    if (!payload) throw new Error("Token not verified");

    req.user = payload;
    console.log(req.user);
    next();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json(error.message);
    }
  }
}
