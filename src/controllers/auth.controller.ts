import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { encrypt, hashData, verifyHash } from "../services/auth.service";
import { signAccessToken } from "../utils/jwt";
import { Role } from "../generated/prisma/client";
import { checkInput } from "../utils/checkReq";
import { ApiError } from "../utils/ApiError"; 

/**
 * STUFF ONLY
 */
export const register = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.entries(req.body).length === 0) throw new ApiError(400, "BAD_REQUEST", "Request body cannot be empty");
    const {
      username,
      password,
      phoneNumber,
      role: reqRole,
      firstName,
      lastName,
      image: {
        mimeType,
        size,
        filename,
        url,
      }
    } = req.body;

    interface RegisterBody {
      username: string,
      password: string,
      phoneNumber: string,
      role: Role,
      firstName: string,
      lastName: string,
    }

    const requiredFields = { username, password, reqRole, phoneNumber, role: reqRole, firstName, lastName } as RegisterBody;
    checkInput(requiredFields);

    function isValidRole(role: unknown): role is Role {
      return Object.values(Role).includes(role as Role);
    }

    if (!isValidRole(reqRole)) {
      throw new ApiError(400, "BAD_REQUEST", `role ${reqRole} is not a valid role`);
    }

    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUser) {
      throw new ApiError(409, "CONFLICT", "User already exists");
    }

    const hashedPassword = await hashData(password);
    const encryptedPhone = phoneNumber ? encrypt(phoneNumber) : null;

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        phoneNumber: encryptedPhone,
        role: reqRole,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        photos: {
          create: [
            {
              mimeType: mimeType,
              filename: filename,
              size: size,
              url: url,
            }
          ],
        },
      },
    });

    return res.status(201).json({
      code: "SUCCESS",
      message: "User created successfully"
    });

  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({
        code: error.code,
        message:error.message,
        details: error.details
      });
    }
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


/**
 * PUBLIC
 */
export const login = async (req: Request, res: Response) => {
  if (req.cookies.access_token) {
    const token = req.cookies.access_token;

    const isExists = await prisma.token.findFirst({
      where: { token: token }
    });

    if (!isExists) {
      return;
    } else {
      const user = await prisma.user.findFirst({
        where: { id: isExists.userId}
      });

      if (user?.role === Role.admin) {
        const params = new URLSearchParams({
          role: "admin",
        });
        res.redirect(`/dashboard?${params.toString()}`);
      } else if (user?.role === Role.coach) {
        const params = new URLSearchParams({
          role: "coach",
        });
        res.redirect(`/dashboard?${params.toString()}`);
      } else {
        res.redirect('/');
      }
    }
  } else {
    if (!req.body || Object.entries(req.body).length === 0) throw new ApiError(400, "BAD_REQUEST", "Request body cannot be empty");

    const { username, password } = req.body;

    interface loginBody {
      username: string,
      password: string,
    }

    const requiredFields = { username, password } as loginBody;

    checkInput(requiredFields);

    const user = await prisma.user.findFirst({
      where: { username: username },
    });

    if (!user) {
      throw new ApiError(401, "UNAUTHORIZED", "Invalid username");
    }

    const valid = await verifyHash(password, user.password);

    if (!valid) {
      throw new ApiError(401, "UNAUTHORIZED", "Invalid password");
    }

    const token = signAccessToken(user.id, user.role);

    await prisma.token.create({
      data: {
        token: token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.redirect('/dashboard');

  }

};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.access_token;

  if (token) {
    await prisma.token.delete({
      where: { token: token },
    });
  }

  res.clearCookie('access_token');
  res.redirect('/');
};
