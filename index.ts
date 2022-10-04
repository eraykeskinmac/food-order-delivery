import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { MONGO_URI } from './src/config';
import { adminRoute } from './src/routes/adminRoute';
import { vendorRoute } from './src/routes/vendorRoute';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/admin', adminRoute);
app.use('/vendor', vendorRoute);

mongoose
  .connect(MONGO_URI as string, {})
  .then(result => {
    console.log('DB Connected');
  })
  .catch(err => console.log('erorr' + err));

app.listen(8000, () => {
  console.clear();
  console.log('App is listening to the port 8000');
});
