import { config } from "./src/config/config";
import app from "./src/app";

const startServer = () => {
  const PORT = config || 8000;
  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};
startServer();
