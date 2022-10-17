import { NextFunction, Request, Response } from 'express';
import { EditVendorInputs, VendorLoginInputs } from '../dto';
import { CreateFoodInputs } from '../dto/food.dto';
import { Offer } from '../models';
import { Food } from '../models/Food';
import { Order } from '../models/Order';
import { GenerateSignature, ValidatePassword } from '../utility';
import { CreateOfferInput } from './../dto/vendor.dto';
import { FindVendor } from './adminController';

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

export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    const orders = await Order.find({ vendorId: user._id }).populate('items.food');
    if (orders != null) {
      return res.status(200).json(orders);
    }
  }

  return res.json({ message: 'Order not found' });
};

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById({ orderId }).populate('items.food');
    if (order != null) {
      return res.status(200).json(order);
    }
  }

  return res.json({ message: 'Order not found' });
};

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.id;

  const { status, remarks, time } = req.body;

  if (orderId) {
    const order = await (await Order.findById(orderId)).populate('food');

    order.orderStatus = status;
    order.remarks = remarks;
    if (time) {
      order.readyTime = time;
    }
    const orderResult = await order.save();
    if (orderResult !== null) {
      return res.status(200).json(orderResult);
    }
  }
  return res.json({ message: 'Unable the process Order' });
};

export const GetOffers = async (req: Request, res: Response, next: NextFunction) => {};

export const AddOffer = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const {
      title,
      description,
      offerType,
      offerAmount,
      pincode,
      promocode,
      promoType,
      startValidity,
      endValidity,
      bank,
      bins,
      minValue,
      isActive,
    } = <CreateOfferInput>req.body;

    const vendor = await FindVendor(user._id);
    if (vendor) {
      const offer = await Offer.create({
        title,
        description,
        offerType,
        offerAmount,
        pincode,
        promocode,
        promoType,
        startValidity,
        endValidity,
        bank,
        bins,
        minValue,
        isActive,
        vendors: [vendor],
      });
      console.log(offer);
      return res.status(200).json(offer);
    }
  }
  return res.json({ message: 'Unable to Add Offer!!!' });
};

export const EditOffer = async (req: Request, res: Response, next: NextFunction) => {};
