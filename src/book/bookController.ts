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
    bookFileName
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
  // Delete Temp Files
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    } else {
      console.log("Cover image file not found for deletion");
    }

    if (fs.existsSync(bookFilePath)) {
      await fs.promises.unlink(bookFilePath);
    } else {
      console.log("Book file not found for deletion");
    }
  } catch (error) {
    console.log(error);
    return next(createHttpError(400, "Temp files not deleted"));
  }

  // res.json({ coverMessage: uploadResult, fileMessage: bookFileUploadResult });

  res.status(201).json({ id: newBook._id });
};

// Update book
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;
  const book = await bookModel.findById(bookId); // Pass bookId directly

  // Check book exist or not
  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }

  // Check access
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "You cannot update others book"));
  }

  // Check if image fields are exists
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let completeCoverImage = ""; // Change to let
  if (files.coverImage) {
    // Delete already cover image from cloudinary
    const coverFileSplits = book.coverImage.split("/");
    const coverImagePublicId =
      coverFileSplits.at(-2) + "/" + coverFileSplits.at(-1)?.split(".").at(-2);
    console.log(coverImagePublicId);

    // Delete normal image from cloudinary
    const bookFileSplite = book.file.split("/");
    const bookFilePublicId =
      bookFileSplite.at(-2) + "/" + bookFileSplite.at(-1);
    console.log(bookFilePublicId);

    // Normal File Delete
    await cloudinary.uploader.destroy(coverImagePublicId);
    //PDF Delete
    await cloudinary.uploader.destroy(bookFilePublicId, {
      resource_type: "raw",
    });

    const filename = files.coverImage[0].filename;
    const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads/" + filename
    );

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: filename,
      folder: "book-covers",
      format: coverMimeType,
    });

    completeCoverImage = uploadResult.secure_url; // No longer causing a reassign error
    await fs.promises.unlink(filePath);
  }

  // Check if file field exists or not (pdf)
  let completeFileName = ""; // Change to let
  if (files.file) {
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads/" + files.file[0].filename
    ); // Ensure proper filename usage
    const bookFileName = files.file[0].filename;

    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-pdfs",
      format: "pdf",
    });

    completeFileName = uploadResultPdf.secure_url; // This should be the URL from upload result
    await fs.promises.unlink(bookFilePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file, // Correct property reference
    },
    {
      new: true,
    }
  );

  res.json(updatedBook);
};

// Get all books
const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find();
    res.json({ books });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while getting books"));
  }
};

const singleBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  try {
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    res.json(book);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while fetching a Book"));
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  try {
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    // check access
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "You cannot delete book"));
    }

    // Delete Cover image from cloudinary
    const coverFileSplits = book.coverImage.split("/");
    const coverImagePublicId =
      coverFileSplits.at(-2) + "/" + coverFileSplits.at(-1)?.split(".").at(-2);

    console.log(coverImagePublicId);

    // Delete normal image from cloudinary
    const bookFileSplite = book.file.split("/");
    const bookFilePublicId =
      bookFileSplite.at(-2) + "/" + bookFileSplite.at(-1);
    console.log(bookFilePublicId);

    // Normal File Delete
    await cloudinary.uploader.destroy(coverImagePublicId);
    //PDF Delete
    await cloudinary.uploader.destroy(bookFilePublicId, {
      resource_type: "raw",
    });

    await bookModel.deleteOne({ _id: bookId });

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while fetching a Book"));
  }
};

export { createBook, updateBook, listBooks, singleBook, deleteBook };
