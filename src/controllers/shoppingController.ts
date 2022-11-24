import { NextFunction, Request, Response } from 'express';
import { Offer, Vendor } from '../models';
import { FoodDoc } from '../models/Food';

export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const pinCode = req.params.pinCode;
  const result = await Vendor.find({ pinCode: pinCode, serviceAvailability: false })
    .sort([['rating', 'descending']])
    .populate('foods');

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: 'Data not found!' });
};

export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  const pinCode = req.params.pinCode;
  const result = await Vendor.find({ pinCode: pinCode, serviceAvailability: false })
    .sort([['rating', 'descending']])
    .limit(10);

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: 'Data not found!' });
};

export const GetFoodIn30Min = async (req: Request, res: Response, next: NextFunction) => {
  const pinCode = req.params.pinCode;
  const result = await Vendor.find({ pinCode: pinCode, serviceAvailability: false }).populate(
    'foods',
  );

  if (result.length > 0) {
    let foodResult: any = [];

    result.map((vendor) => {
      const foods = vendor.foods as [FoodDoc];
      foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });

    return res.status(200).json(foodResult);
  }

  return res.status(400).json({ message: 'Data not found!' });
};

export const SearchFood = async (req: Request, res: Response, next: NextFunction) => {
  const pinCode = req.params.pinCode;
  const result = await Vendor.find({ pinCode: pinCode, serviceAvailability: false }).populate(
    'foods',
  );

  if (result.length > 0) {
    let foodResult: any = [];
    result.map((item) => foodResult.push(...item.foods));

    return res.status(200).json(foodResult);
  }
  return res.status(400).json({ message: 'Data not found!' });
};

export const RestaurantById = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const result = await Vendor.findById(id).populate('foods');

  if (result) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: 'Data not found!' });
};

export const GetAvailableOffers = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode;

  const offers = await Offer.find({ pincode: pincode, isActive: true });

  if (offers) {
    return res.status(200).json(offers);
  }
  return res.status(400).json({ message: 'Offers Not Found' });
};
