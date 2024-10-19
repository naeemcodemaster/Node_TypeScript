import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  mongo_url: process.env.MONGO_URL,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  cloudinaryCloud: process.env.CLOUDINARY_CLOUD,
  cloudinaryAPIKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryAPISecret: process.env.CLOUDINARY_API_SECRET,
  frontendDomain: process.env.FRONTEND_DOMAIN,
};

// port overwrite nhi hoga dosri file me freeze kya hua a.
export const config = Object.freeze(_config);
