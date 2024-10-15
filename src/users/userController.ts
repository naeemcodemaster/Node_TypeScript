import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  // Check existing email in Mongodb
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const error = createHttpError(400, "User already exist with this email.");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while getting user" + error));
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // store inside db
  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while Creating user" + error));
  }

  try {
    // Add JWT Token
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
    res.status(201).json({ accessToken: token });
  } catch (error) {
    return next(
      createHttpError(500, "Error while Signing the JWT token" + error)
    );
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {};

export { createUser, loginUser };
