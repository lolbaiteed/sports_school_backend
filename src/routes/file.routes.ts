import { Router } from 'express';
import { upload, uploadImage } from '../controllers/file.controller';
import { Role } from '../generated/prisma/client';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

//TODO: Write docs for upload route
/**
* @openapi
* /api/files/uploadImage:
*   post:
*     summary: Upload images to server
*     tags: [Files]
*/
router.post("/uploadImage",authenticate, authorize(Role.admin, Role.coach), upload.single("avatar"), uploadImage);

//TODO: finish show route and add docs
// router.post("/:filename");

// TODO: finish delete route and add docs
// router.delete("/delete/:id");

//TODO: finish the route and add docs
// router.post("/download");

export default router;
