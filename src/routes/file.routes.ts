import { Router } from 'express';
import { Role } from '../generated/prisma/client.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();


//TODO: finish show route and add docs
// router.post("/:filename");

// TODO: finish delete route and add docs
// router.delete("/delete/:id");

//TODO: finish the route and add docs
// router.post("/download");

export default router;
