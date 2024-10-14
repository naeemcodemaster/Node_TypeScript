import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("DB has been connected");
    });

    mongoose.connection.on("error", (error) => {
      console.log("Error in connecting to DB", error);
    });
    await mongoose.connect(config.mongo_url as string);
  } catch (error) {
    console.error("Failed to connect with DB", error);

    // DB say connection failed py server ko stop kry gy
    process.exit(1);
  }
};

export default connectDB;
