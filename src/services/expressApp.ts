import bodyParser from 'body-parser';
import express, { Application } from 'express';
import path from 'path';
import { adminRoute } from '../routes/adminRoute';
import { vendorRoute } from '../routes/vendorRoute';
import shoppingRoute from '../routes/shoppingRoute';
import { customerRoute } from '../routes';

export default async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/images', express.static(path.join(__dirname, 'images')));

  app.use('/admin', adminRoute);
  app.use('/vendor', vendorRoute);
  app.use('/customer', customerRoute);
  app.use(shoppingRoute);

  return app;
};
