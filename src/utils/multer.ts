import multer from 'multer';
import path from 'path';

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
