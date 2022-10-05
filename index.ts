import express from 'express';
import App from './src/services/expressApp';
import dbConnection from './src/services/database';

const startServer = async () => {
  const app = express();
  await dbConnection();
  await App(app);

  app.listen(8000, () => {
    console.log('listening port 8000');
  });
};
startServer().then((r) => r);
