import { v2 as cloudinary } from "cloudinary";
import { config } from "./config";
cloudinary.config({
  cloud_name: config.cloudinaryCloud,
  api_key: config.cloudinaryAPIKey,
  api_secret: config.cloudinaryAPISecret,
});

export default cloudinary;
