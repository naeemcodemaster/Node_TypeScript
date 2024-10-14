import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  mongo_url: process.env.MONGO_URL,
};

// port overwrite nhi hoga dosri file me freeze kya hua a.
export const config = Object.freeze(_config);
