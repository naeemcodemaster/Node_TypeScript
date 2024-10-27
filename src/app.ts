import express from "express";
import cors from "cors";
// import createHttpError from "http-errors";
import globleErrorhandler from "./middlewares/globalErrorhandler";
import userRouter from "./users/userRouter";
import bookRouter from "./book/bookRouter";
import { config } from "./config/config";

const app = express();
// CORS configuration with custom function to handle multiple allowed origins
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [config.frontendDomain, config.reactApp];
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());
// Routes
app.get("/", (req, res) => {
  //   const error = createHttpError(400, "Something went wrong");
  //   throw error;
  res.json({ message: "Welcome to E APIs" });
});

app.use("/api/users/", userRouter);
app.use("/api/books", bookRouter);
app.use(globleErrorhandler);

export default app;
