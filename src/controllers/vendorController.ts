import { NextFunction, Request, Response } from 'express';
import { EditVendorInputs, VendorLoginInputs } from './../dto/vendor.dto';
import {
  GenerateSignature,
  ValidatePassword,
} from './../utility/passwordUtility';
import { FindVendor } from './adminController';

export const vendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInputs>req.body;

  const existingVendor = await FindVendor('', email);

  if (existingVendor !== null) {
    const validation = await ValidatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: existingVendor.id,
        email: existingVendor.email,
        foodTypes: existingVendor.foodType,
        name: existingVendor.name,
      });

      return res.json(signature);
    } else {
      return res.json({ message: 'Invalid password' });
    }
  }

  return res.json({ message: 'Login credentials are incorrect' });
};

export const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);
    return res.json(existingVendor);
  }

  return res.json({ message: 'Vendor information not found' });
};

export const updateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { foodTypes, name, address, phone } = <EditVendorInputs>req.body;
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor !== null) {
      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.phone = phone;
      existingVendor.foodType = foodTypes;

      const savedResults = await existingVendor.save();
      return res.json(savedResults);
    }
    return res.json(existingVendor);
  }

  return res.json({ message: 'Vendor information not found' });
};

export const updateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { foodTypes, name, address, phone } = <EditVendorInputs>req.body;
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor !== null) {
      existingVendor.serviceAvailability = !existingVendor.serviceAvailability;
      const savedResults = await existingVendor.save();
      return res.json(savedResults);
    }
    return res.json(existingVendor);
  }

  return res.json({ message: 'Vendor information not found' });
};
