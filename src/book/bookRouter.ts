import express from "express";
import {
  createBook,
  deleteBook,
  listBooks,
  singleBook,
  updateBook,
} from "./bookController";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate";
const bookRouter = express.Router();

// file store local  ->
const upload = multer({
  dest: path.resolve("/tmp", "uploads"), // Use the /tmp directory for uploads
  limits: { fileSize: 3e7 }, // Limit file size to 30MB
  fileFilter: (req, file, cb) => {
    // Check the file size in the request headers; reject if it exceeds 10MB
    if (
      req.headers["content-length"] &&
      parseInt(req.headers["content-length"]) > 10 * 1024 * 1024
    ) {
      return cb(
        new Error("File size exceeds the 10MB limit") as unknown as null,
        false
      );
    }
    cb(null, true); // Accept the file if it meets the condition
  },
});

// Add New Book
bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

// Update Book
bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

// Get all books
bookRouter.get("/", listBooks);

// get Single book
bookRouter.get("/:bookId", singleBook);

bookRouter.delete("/:bookId", authenticate, deleteBook);

export default bookRouter;
