import { config } from "./src/config/config";
import app from "./src/app";
import connectDB from "./src/config/db";

const startServer = async () => {
  await connectDB();
  const PORT = config || 8000;
  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT.port}`);
  });
};
startServer();
