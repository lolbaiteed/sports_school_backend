import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { checkInput } from "../utils/checkReq";
import { prisma } from '../db/prisma';
import { encrypt } from "../services/auth.service";
import { Discipline } from "../generated/prisma/client";
import { isValidDiscipline } from "../services/verify.service";

export const registerStudent = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.entries(req.body).length === 0) throw new ApiError(400, "BAD_REQUEST", "Request body cannot be empty");
    const {
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      coachId,
      discipline: disciplineReq,
      image,
    } = req.body;

    interface registerStudentBody {
      firstName: string,
      lastName: string,
      dateOfBirth: string,
      phoneNumber: string,
      coachId: number,
      discipline: Discipline
    }

    const requiredFileds = { firstName, lastName, dateOfBirth, phoneNumber, coachId, discipline: disciplineReq } as registerStudentBody;
    checkInput(requiredFileds);

    const { mimeType, size, filename, url } = image ?? {};

    const phoneEnc = encrypt(phoneNumber);

    const existingUser = await prisma.student.findUnique({
      where: { phoneNumber: phoneEnc },
    });

    if (existingUser) {
      throw new ApiError(409, "CONFLICT", "User already exists");
    }

    const dateConverted = new Date(dateOfBirth);

    const coach = await prisma.user.findUnique({
      where: { id: coachId },
    });

    if (!coach) throw new ApiError(404, "NOT_FOUND", `Coach with ID: ${coachId} not exists`);

    await prisma.student.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateConverted,
        phoneNumber: phoneEnc,
        discipline: disciplineReq,
        ...(image && {
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
        }),
        coach: {
          connect: { id: coach.id },
        },
      },
    });

    res.status(201).json({
      code: "CREATED",
      message: "Student created successfully"
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        details: error.details
      });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.params.id);

    if (Number.isNaN(studentId)) {
      throw new ApiError(400, "BAD_REQUEST", "Student id must be a number");
    };

    if (!studentId) throw new ApiError(400, "BAD_REQUEST", "Sutdent id must be set");

    const studentExists = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!studentExists) throw new ApiError(404, "NOT_FOUND", "Student not exists");

    await prisma.student.delete({
      where: { id: studentExists.id },
    });

    return res.status(200).json({
      code: "SUCCESS",
      message: "Student deleted successfully"
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

export const editStudent = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.entries(req.body).length === 0) throw new ApiError(400, "BAD_REQUEST", "Request body cannot be empty");

    const {
      phoneNumber,
      firstName,
      lastName,
      dateOfBirth,
      discipline: disciplineReq,
      oldImgId,
      image
    } = req.body;

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "BAD_REQUEST", "StudentId must be a number");
    };

    const { mimeType, size, filename, url } = image ?? {};

    if(!isValidDiscipline(disciplineReq)) {
      throw new ApiError(400, "BAD_REQUEST", "Unknown discipline");
    }

    const oldData = await prisma.student.findUnique({
      where: {id},
    });

    if (!oldData) throw new ApiError(404, "NOT_FOUND", "Student is not exists");

    const phoneEnc = phoneNumber ? encrypt(phoneNumber) : undefined;

    await prisma.student.update({
      where: { id: oldData.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        dateOfBirth: dateOfBirth || undefined,
        phoneNumber: phoneEnc,
        discipline: disciplineReq || undefined,
        photos: image ? {
          upsert: {
            where: { id: oldImgId },
            update: {
              mimeType,
              size,
              filename,
              url,
            },
            create: {
              mimeType,
              size,
              filename,
              url,
            },
          },
        } : undefined,
      },
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
      message: "Unexpected error, try again"
    });
  }
};
