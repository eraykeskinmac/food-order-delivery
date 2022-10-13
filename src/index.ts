import express from 'express';
import { PORT } from './config';
import dbConnection from './services/database';
import App from './services/expressApp';

const startServer = async () => {
  const app = express();
  await dbConnection();
  await App(app);

  app.listen(8000, () => {
    console.log(`Listening to port ${PORT}`);
  });
};
startServer().then(r => r);
