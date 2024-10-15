import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  // Check existing email in Mongodb
  const user = await userModel.findOne({ email: email });
  if (user) {
    const error = createHttpError(400, "User already exist with this email.");
    return next(error);
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // store inside db
  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  // Add JWT Token
  const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
  res.json({ accessToken: token });
};

export { createUser };
