import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { checkInput } from '../utils/checkReq';
import { prisma } from '../db/prisma';

export const addEvent = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new ApiError(400, "BAD_REQUEST", "Request body cannot be empty/null");
    }

    interface AddEventBody {
      eventName: string,
      latitude: number,
      longitude: number,
      startDate: string,
      endDate: string,
      image?: {
        mimeType: string,
        size: number,
        filename: string,
        url: string
      },
    }

    const {
      eventName,
      latitude,
      longitude,
      startDate,
      endDate,
      image,
    } = req.body as AddEventBody;

    const requiredFields = { eventName, latitude, longitude, startDate, endDate};

    checkInput(requiredFields);
    await prisma.event.create({
      data: {
        eventName: eventName,
        latitude: latitude,
        longitude: longitude,
        startDate: startDate,
        endDate: endDate,
        ...(image && {
          photos: {
            create: {
              mimeType: image.mimeType,
              size: image.size,
              filename: image.filename,
              url: image.url,
            }, 
          },
        }),
      },
    });

    return res.status(201).json({ 
      code: "SUCCESS",
      message: "Event added successfully"
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

export const editEvent = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.entries(req.body).length === 0) throw new ApiError(400, "BAD_REQUEST", "Request body cannot be empty");

    const eventId = Number(req.query.id);

    if (Number.isNaN(eventId)) {
      throw new ApiError(400, "BAD_REQUEST", "Event ID must be a number");
    }

    const {
      eventName,
      latitude,
      longitude,
      startDate,
      endDate,
      image,
    } = req.body;

    const { mimeType, size, filename, url } = image ?? {};

    //FIX: we need to update photo if exists or add
    await prisma.event.update({
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

    return res.status(200).json({
      code: "SUCCESS",
      message: "Event edited successfully"
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const eventId = Number(req.query.id);

    if (!eventId) throw new ApiError(400, "BAD_REQUEST", "Event ID must be set");

    if(Number.isNaN(eventId)) {
      throw new ApiError(400, "BAD_REQUEST", "Event id must be a number");
    }

    const  isExists = await prisma.event.findUnique({
      where: {id: eventId},
    });

    if (!isExists) throw new ApiError(404, "NOT_FOUND", "Event is not exists");

    await prisma.event.delete({
      where: {id: eventId},
    });

    return res.status(200).json({
      code: "SUCCESS",
      message: "Event deleted successfully"
    })
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        details: error.stack
      });
    }
  }
};
