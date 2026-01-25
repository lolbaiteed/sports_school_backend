import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/client";
import { ApiError } from "../utils/ApiError";

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

    if (!token) throw new ApiError(401, "UNAUTHORIZED", "Authenticate token not found");

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as unknown as JwtPayload;

    if (!payload.sub || !payload.role) throw new ApiError(401, "UNAUTHORIZED", "Authenticate token is invalid or expired");

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        details: error.details
      });
    }
  }
}
