import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { encrypt, hashData, verifyHash } from "../services/auth.service";
import { signAccessToken, verifyAccessToken } from "../utils/jwt";
import { Role } from "../generated/prisma/client";

/**
 * STUFF ONLY
 */
export const register = async (req: Request, res: Response) => {
  try {
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

    if (!username || !password || !reqRole) {
      return res.status(400).json({ message: "Missing fields" });
    }

    function isValidRole(role: unknown): role is Role {
      return Object.values(Role).includes(role as Role);
    }

    if (!isValidRole(reqRole)) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await hashData(password);
    const encryptedPhone = phoneNumber ? encrypt(phoneNumber) : null;

    const user = await prisma.user.create({
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
      id: user.id,
      username: user.username,
      role: user.role,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const registerStudent = async (req: Request, res: Response) => {
  try {
    if (!req.body) return res.status(400).json({ error: "Empty body recieved" });
    const {
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      coachId,
      image: {
        mimeType,
        size,
        filename,
        url,
      }
    } = req.body;

    if (!lastName || !firstName || !dateOfBirth || !coachId) {
      return res.status(400).json({ error: "Missing credentials" });
    }
    const phoneEnc = encrypt(phoneNumber);

    const existingUser = await prisma.student.findUnique({
      where: { phoneNumber: phoneEnc },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const dateConverted = new Date(dateOfBirth);

    const coach = await prisma.user.findUnique({
      where: { id: coachId },
    });

    if (!coach) return res.status(400).json({ error: "Coach with this ID not exists" });

    const student = await prisma.student.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateConverted,
        phoneNumber: phoneEnc,
        photos: {
          create: [
            {
              mimeType: mimeType,
              size: size,
              filename: filename,
              url: url,
            },
          ],
        },
        coach: {
          connect: { id: coach.id },
        },
      },
    });

    if (!student) return res.status(500).json({ error: "Cannot create student" });

    res.status(201).json({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.lastName,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const editCoach = async (req: Request, res: Response) => {
  try {
    if (!req.body) return res.status(400).json({ error: "Empty req.body recieved" });

    const {
      username,
      password,
      phoneNumber,
      role: reqRole,
      firstName,
      lastName,
      imgId,
      image,
    } = req.body;

    const { mimeType, size, filename, url } = image ?? {};

    if (!username || !password || !reqRole) {
      return res.status(400).json({ message: "Missing fields" });
    }

    function isValidRole(role: unknown): role is Role {
      return Object.values(Role).includes(role as Role);
    }

    if (!isValidRole(reqRole)) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    const existingUser = await prisma.user.findFirst({
      where: { username },
    });


    const hashedPassword = await hashData(password);
    const encryptedPhone = phoneNumber ? encrypt(phoneNumber) : null;

    if (existingUser) {
      const newUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          username: username,
          password: hashedPassword,
          phoneNumber: encryptedPhone,
          role: reqRole,
          firstName: firstName,
          lastName: lastName,
          photos: image ? {
            update: [
              {
                where: { id: imgId.id },
                data: {
                  mimeType: mimeType,
                  size: size,
                  url: url,
                  filename: filename,
                },
              },
            ],
          } : undefined,
        },
      });

      return res.status(200).json(newUser);
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }

}

export const addEvent = async (req: Request, res: Response) => {
  try {
    if (!req.body) return res.status(400).json({ error: "Empty body recieved" });

    const {
      eventName,
      latitude,
      longitude,
      startDate,
      endDate,
      image,
    } = req.body;

    const { mimeType, size, filename, url } = image ?? {};

    const event = await prisma.event.create({
      data: {
        eventName: eventName,
        latitude: latitude,
        longitude: longitude,
        startDate: startDate,
        endDate: endDate,
        photos: {
          create: {
            mimeType: mimeType,
            size: size,
            filename: filename,
            url: url,
          },
        },
      },
    });

    return res.status(201).json(event);

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    if (!req.body) return res.status(400).json({ error: "Empty body recieved" });

    const {
      studentId
    } = req.body;

    const studentExists = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!studentExists) return res.status(400).json({ error: "Student with this ID not exists" });

    await prisma.student.delete({
      where: { id: studentExists.id },
    });

    return res.status(200).json({ message: "done" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteCoach = async (req: Request, res: Response) => {
  try {
    if (!req.body) return res.status(400).json({ error: "Empty body recieved" });

    const {
      coachId
    } = req.body;

    const coachExists = await prisma.user.findFirst({
      where: { id: coachId, role: Role.coach },
    });

    if (!coachExists) return res.status(400).json({ error: "Coach with this ID not exists" });

    await prisma.user.delete({
      where: { id: coachExists.id, role: Role.coach },
    });

    return res.status(200).json({ message: "done" });
  } catch (error) {

    return res.status(500).json({ message: "Internal server error" });
  }
}

export const editEvent = async (req: Request, res: Response) => {
  try {
    if (!req.body) return res.status(400).json({ error: "Empty body recieved" });

    const {
      eventName,
      latitude,
      longitude,
      startDate,
      endDate,
      eventId,
      image,
    } = req.body;

    const { mimeType, size, filename, url } = image ?? {};

    const newEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        eventName: eventName,
        latitude: latitude,
        longitude: longitude,
        startDate: startDate,
        endDate: endDate,
        photos: image ? {
          create: {
            mimeType: mimeType,
            size: size,
            filename: filename,
            url: url,
          },
        } : undefined,
      },
    });

    return res.status(200).json(newEvent);

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

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
      res.redirect('/dashboard');
    }
  } else {
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

    const valid = await verifyHash(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
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
