import express from "express";
// import createHttpError from "http-errors";
import globleErrorhandler from "./middlewares/globalErrorhandler";
import userRouter from "./users/userRouter";
import bookRouter from "./book/bookRouter";

const app = express();
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
