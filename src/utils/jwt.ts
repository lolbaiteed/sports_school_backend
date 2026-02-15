import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/client.js";

const JWT_EXPIRES_IN = "15m";

export function signAccessToken(userId: number, role: Role) {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(
    { sub: userId, role },
    secret,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyAccessToken(token: string) {
  const secret = process.env.JWT_SECRET!;
  return jwt.verify(
    token,
   secret 
  );
}
