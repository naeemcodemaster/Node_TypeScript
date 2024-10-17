import express from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "node:path";
const bookRouter = express.Router();

// file store local  ->
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 }, // byte me data store kry ga.    // 30MB  <=  30 * 1024 * 1024
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
