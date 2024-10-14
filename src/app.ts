import express from "express";
// import createHttpError from "http-errors";
import globleErrorhandler from "./middlewares/globalErrorhandler";
import userRouter from "./users/userRouter";

const app = express();

// Routes
app.get("/", (req, res) => {
  //   const error = createHttpError(400, "Something went wrong");
  //   throw error;
  res.json({ message: "Welcome to E APIs" });
});

app.use("/api/users/", userRouter);
app.use(globleErrorhandler);

export default app;
