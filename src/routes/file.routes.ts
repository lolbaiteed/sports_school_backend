import { Router, Request, Response } from 'express';
import { upload } from '../utils/multer';

const router = Router();

router.post("/upload", upload.single("avatar"), (req: Request, res: Response) => {
  if(!req.file) return res.status(400).json({ error: "No file sended" });
  const file = req.file;
  
  res.json({
    filename: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    url: file.path, 
  });
});

export default router;
