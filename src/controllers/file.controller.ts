import multer from 'multer';
import path from 'path';
import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

const storage = multer.diskStorage({
  destination: function(_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename: function(_req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + Date.now() + ext;
    cb(null, name);
  },
});

export const upload = multer({
  storage: storage,
  limits: {fieldSize: 5 * 1024 * 1024},
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images allowed"));
    }
    cb(null, true);
  }
});

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) throw new ApiError(400, "BAD_REQUEST", "No file sended");
    const file = req.file;

    res.json({
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      url: file.path,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        details: error.stack
      });
    } else if (error instanceof multer.MulterError) {

    }
  }
} 
