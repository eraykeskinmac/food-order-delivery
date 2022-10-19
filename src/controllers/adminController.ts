import { NextFunction, Request, Response } from 'express';
import { CreateVendorInput } from '../dto';
import { DeliveryUser, Transaction, Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';

export const FindVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return Vendor.findOne({ email: email });
  } else {
    return Vendor.findById(id);
  }
};

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
  const { name, address, pinCode, foodType, email, password, ownerName, phone } = <
    CreateVendorInput
  >req.body;

  const existingVendor = await FindVendor('', email);

  if (existingVendor !== null) {
    return res.json({ message: 'A vendor is exist with this email ID' });
  }

  // generate a salt
  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);
  // encrypt the password using the salt

  const createdVendor = await Vendor.create({
    name: name,
    address: address,
    pinCode: pinCode,
    foodType: foodType,
    email: email,
    password: userPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailability: false,
    coverImages: [],
    foods: [],
  });

  return res.json(createdVendor);
};

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
  const vendors = await Vendor.find({});

  if (vendors !== null) {
    return res.json(vendors);
  }

  return res.json({ message: 'No vendors found' });
};

export const GetVendorByID = async (req: Request, res: Response, next: NextFunction) => {
  const vendorId = req.params.id;

  const vendor = await FindVendor(vendorId);

  if (vendor !== null) {
    return res.json(vendor);
  }

  return res.json({ message: 'No vendor found' });
};

export const GetTransactions = async (req: Request, res: Response, next: NextFunction) => {
  const transactions = await Transaction.find();

  if (transactions) {
    return res.status(200).json(transactions);
  }
  return res.json({ message: 'Transactions not available' });
};

export const GetTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const transaction = await Transaction.findById(id);

  if (transaction) {
    return res.status(200).json(transaction);
  }
  return res.json({ message: 'Transaction not available' });
};

export const VerifyDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {
  const { _id, status } = req.body;

  if (_id) {
    const profile = await DeliveryUser.findById(_id);
    if (profile) {
      profile.verified = status;

      const result = await profile.save();
      return res.status(200).json(result);
    }
  }
  return res.status(400).json({ message: 'Unable to verify Delivery User' });
};

export const GetDeliveryUsers = async (req: Request, res: Response, next: NextFunction) => {
  const deliveryUsers = await DeliveryUser.find();
  if (deliveryUsers) {
    return res.status(200).json(deliveryUsers);
  }

  return res.status(400).json({ message: 'Unable to Get Delivery Users' });
};
