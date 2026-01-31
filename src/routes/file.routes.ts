import { Router, Request, Response } from 'express';
import { upload } from '../utils/multer';
import { ApiError } from '../utils/ApiError';

const router = Router();

//TODO: Write docs for upload route
router.post("/upload", upload.single("avatar"), (req: Request, res: Response) => {
  try {
    if(!req.file) throw new ApiError(400, "BAD_REQUEST", "No file sended");
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
    } 
  }
});

//TODO: finish the route and add docs
// router.post("/download")

export default router;
