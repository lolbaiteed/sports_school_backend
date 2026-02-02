import { Response, Request } from "express";
import { prisma } from '../db/prisma';
import { ApiError } from "../utils/ApiError";
import { Role, Discipline } from '../generated/prisma/client';
import { hashData, encrypt } from "../services/auth.service";
import { checkInput } from "../utils/checkReq";
import { isValidDiscipline, isValidRole } from "../services/verify.service";

export const editCoach = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.entries(req.body).length === 0) throw new ApiError(400, "BAD_REQUEST", "Request body cannot be empty");

    const {
      username,
      password,
      firstName,
      lastName,
      discipline: reqDiscipline,
      role: reqRole,
      phoneNumber
    } = req.body;

    const image = req.file;

    const coachId = Number(req.params.id);

    if (Number.isNaN(coachId)) {
      throw new ApiError(400, "BAD_REQUEST", "CoachId must be a number");
    };

    const coach = await prisma.user.findUnique({
      where: { id: coachId, role: Role.coach },
      include: {
        photos: {
          where: {
            filename: { startsWith: "avatar" },
          },
          take: 1,
        },
      }
    });

    if (!coach) {
      throw new ApiError(404, "NOT_FOUND", "Coach not found");
    }

    const oldPhoto = coach.photos[0];

    if (reqRole) {
      if (!isValidRole(reqRole)) {
        throw new ApiError(400, "BAD_REQUEST", "Invalid role value");
      }
    }

    if (reqDiscipline) {
      if (!isValidDiscipline(reqDiscipline)) {
        throw new ApiError(400, "BAD_REQUEST", "Invalid discipline value");
      }
    }

    const hashedPassword = password ? await hashData(password) : undefined;
    const encryptedPhone = phoneNumber ? encrypt(phoneNumber) : undefined;

    await prisma.user.update({
      where: { id: coach.id },
      data: {
        username: username || undefined,
        password: hashedPassword,
        phoneNumber: encryptedPhone,
        role: reqRole || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        discipline: reqDiscipline || undefined,
        photos: image ? {
          upsert: {
            where: { id: oldPhoto.id },
            update: {
              mimeType: image.mimetype,
              size: image.size,
              url: image.path,
              filename: image.filename,
            },
            create: {
              mimeType: image.mimetype,
              size: image.size,
              url: image.path,
              filename: image.filename,
            },
          },
        } : undefined,
      },
    });

    return res.status(200).json({
      code: "SUCCESS",
      message: "Coach edited successfully"
    });

  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        details: error.details
      });
    }
    return res.status(500).json({ message: error });
  }
};

export const deleteCoach = async (req: Request, res: Response) => {
  try {
    const coachId = Number(req.params.id);

    if (Number.isNaN(coachId)) {
      throw new ApiError(400, "BAD_REQUEST", "Coach id must be a number");
    }

    const coachExists = await prisma.user.findFirst({
      where: { id: coachId, role: Role.coach },
    });

    if (!coachExists) throw new ApiError(404, "NOT_FOUND", "Coach not exists");

    await prisma.user.delete({
      where: { id: coachExists.id, role: Role.coach },
    });

    return res.status(200).json({
      code: "SUCCESS",
      message: "Coach deleted successfully"
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        details: error.details
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addCoach = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.entries(req.body).length === 0) throw new ApiError(400, "BAD_REQUEST", "Request body cannot be empty");

    const {
      username,
      password,
      phoneNumber,
      role: reqRole,
      firstName,
      lastName,
      discipline: reqDiscipline,
    } = req.body;

    const image = req.file;
    ;
    interface CoachRequestBody {
      username: string,
      password: string,
      phoneNumber: string,
      role: Role,
      firstName: string,
      lastName: string,
      discipline: Discipline,
    }

    const requiredFiels = { username, password, phoneNumber, role: reqRole, firstName, lastName, discipline: reqDiscipline } as CoachRequestBody;
    checkInput(requiredFiels);


    const CoachExists = await prisma.user.findUnique({
      where: { username: username },
    });

    if (CoachExists) {
      throw new ApiError(409, "CONFLICT", "Coach with this username already exists");
    };

    const hashedPassword = await hashData(password);
    const phoneEnc = encrypt(phoneNumber);

    await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        phoneNumber: phoneEnc,
        role: Role.coach,
        firstName: firstName,
        lastName: lastName,
        discipline: reqDiscipline,
        ...(image && {
          photos: {
            create: [
              {
                url: image.path,
                mimeType: image.mimetype,
                filename: image.filename,
                size: image.size,
              },
            ],
          },
        }),
      }
    });
    return res.status(201).json({
      code: "CREATED",
      message: "Coach created successfully"
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        details: error.stack
      });
    }
    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpedted error, try again",
      details: []
    });
  }
};
