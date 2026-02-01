import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "15m";

export function signAccessToken(userId: number, role: Role) {
  return jwt.sign(
    { sub: userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(
    token,
    JWT_SECRET
  );
}
