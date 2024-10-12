import app from "./src/app";

const startServer = () => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};
startServer();
