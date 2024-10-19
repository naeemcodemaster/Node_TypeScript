import express from "express";
import cors from "cors";
// import createHttpError from "http-errors";
import globleErrorhandler from "./middlewares/globalErrorhandler";
import userRouter from "./users/userRouter";
import bookRouter from "./book/bookRouter";
import { config } from "./config/config";

const app = express();
app.use(
  cors({
    origin: config.frontendDomain,
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
