import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
};

// port overwrite nhi hoga dosri file me freeze kya hua a.
export const config = Object.freeze(_config);
