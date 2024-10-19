import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import bookModel from "./bookModel";
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  // Cover Image upload work here
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1); // e.g image/png
  const fileName = files.coverImage[0].filename;
  const filePath = path.join(__dirname, "../../public/data/uploads", fileName);

  const uploadResult = await cloudinary.uploader.upload(filePath, {
    filename_override: fileName,
    folder: "book-covers",
    format: coverImageMimeType,
  });

  // file image upload work here
  const bookFileName = files.file[0].filename;
  const bookFilePath = path.join(
    __dirname,
    "../../public/data/uploads",
    fileName
  );

  const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
    resource_type: "raw",
    filename_override: bookFileName,
    folder: "book-pdfs",
    format: "pdf",
  });

  const _req = req as AuthRequest;

  const newBook = await bookModel.create({
    title,
    genre,
    author: _req.userId,
    coverImage: uploadResult.secure_url,
    file: bookFileUploadResult.secure_url,
  });

  console.log("First path", filePath);
  console.log("second path ", bookFilePath);
  // Delete Temp Files
  try {
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);
  } catch (error) {
    console.log(error);
    next(createHttpError(400, "Temp files not deleted"));
  }

  // res.json({ coverMessage: uploadResult, fileMessage: bookFileUploadResult });

  res.status(201).json({ id: newBook._id });
};

export { createBook };
