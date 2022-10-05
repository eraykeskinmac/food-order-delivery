import { NextFunction, Request, Response } from 'express';
import { Food } from '../models/Food';
import { GenerateSignature, ValidatePassword } from '../utility';
import { FindVendor } from './adminController';
import { CreateFoodInputs } from '../dto/food.dto';
import { EditVendorInputs, VendorLoginInputs } from '../dto';

export const vendorLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = <VendorLoginInputs>req.body;

  const existingVendor = await FindVendor('', email);

  if (existingVendor !== null) {
    const validation = await ValidatePassword(
      password,
      existingVendor.password,
      existingVendor.salt,
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

export const getVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);
    return res.json(existingVendor);
  }

  return res.json({ message: 'Vendor information not found' });
};

export const updateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
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

export const updateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file: Express.Multer.File) => file.filename);

      vendor.coverImages.push(...images);

      const result = await vendor.save();
      return res.json(result);
    }
  }
  return res.json({ message: 'Vendor information not found' });
};

export const updateVendorService = async (req: Request, res: Response, next: NextFunction) => {
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

export const addFood = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    const { name, description, category, foodType, readyTime, price } = <CreateFoodInputs>req.body;

    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      const createFood = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        readyTime: readyTime,
        images: images,
        price: price,
        rating: 0,
      });
      vendor.foods.push(createFood);
      const result = await vendor.save();

      return res.json(result);
    }
  }
};

export const getFoods = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vendorId: user._id });

    if (foods !== null) {
      return res.json(foods);
    }
  }

  return res.json({ message: 'Foods information not found' });
};
