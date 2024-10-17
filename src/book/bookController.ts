import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.files);

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

  res.json({ coverMessage: uploadResult, fileMessage: bookFileUploadResult });
};

export { createBook };
