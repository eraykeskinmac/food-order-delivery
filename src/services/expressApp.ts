import express, { Application } from 'express';
import path from 'path';
import { customerRoute } from '../routes';
import { adminRoute } from '../routes/adminRoute';
import shoppingRoute from '../routes/shoppingRoute';
import { vendorRoute } from '../routes/vendorRoute';

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/images', express.static(path.join(__dirname, '../images')));

  app.use('/admin', adminRoute);
  app.use('/vendor', vendorRoute);
  app.use('/customer', customerRoute);
  app.use(shoppingRoute);

  return app;
};
