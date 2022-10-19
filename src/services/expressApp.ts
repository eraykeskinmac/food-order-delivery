import express, { Application } from 'express';
import path from 'path';
import { adminRoute, customerRoute, deliveryRoute, vendorRoute } from '../routes';
import shoppingRoute from '../routes/shoppingRoute';

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/images', express.static(path.join(__dirname, '../images')));

  app.use('/admin', adminRoute);
  app.use('/vendor', vendorRoute);
  app.use('/customer', customerRoute);
  app.use('/delivery', deliveryRoute);
  app.use(shoppingRoute);

  return app;
};
