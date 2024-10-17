import express from "express";
import { createBook } from "./bookController";
import multer, { FileFilterCallback } from "multer";
import path from "node:path";
const bookRouter = express.Router();

// file store local  ->
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 }, // byte me data store kry ga.    // 30MB  <=  30 * 1024 * 1024
  fileFilter: (req, file, cb: FileFilterCallback) => {
    // Check the file size in the request headers if the file is less than 10MB
    if (
      req.headers["content-length"] &&
      parseInt(req.headers["content-length"]) > 10 * 1024 * 1024
    ) {
      return cb(new Error("File size exceeds the 10MB limit") as any, false);
    }
    cb(null, true); // Accept the file if it meets the condition
  },
});

bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default bookRouter;
