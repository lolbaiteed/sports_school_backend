import { Response, NextFunction } from "express";
import { Role } from "../generated/prisma/client";
import { AuthRequest } from "./auth";
import { ApiError } from "../utils/ApiError";

export function authorize(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "UNAUTHORIZED", "Authenticate token is missing or invalid");
      }

      if (!roles.includes(req.user.role)) {
        throw new ApiError(403, "FORBIDDEN", "You're not allowed to use this route");
      }

      next();
    } catch (error) {
      if(error instanceof ApiError) {
        return res.status(error.status).json({
          code: error.code,
          message: error.message,
          details: error.details
        });
      }
    }
  };
}
