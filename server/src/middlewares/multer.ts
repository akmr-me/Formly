import multer from "multer";
import fs from "fs";
import path from "path";
import { env } from "../config/env";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { id: blockId } = req.params;

    if (!blockId) {
      return cb(new Error("blockId is required in params"), "");
    }

    const folderPath = path.join("public", "cover", blockId);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const existingFiles = fs.readdirSync(folderPath);
    for (const oldFile of existingFiles) {
      const oldPath = path.join(folderPath, oldFile);
      fs.unlinkSync(oldPath);
    }

    cb(null, folderPath);

    const fullPath = path.join("cover", blockId, file.originalname);
    const dbPath = "/" + fullPath.replace(/\\/g, "/");
    req.body.coverImagePath = dbPath;
    req.body.coverImageOrigin = env.ASSETS_BASE_URL;
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
