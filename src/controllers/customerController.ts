import { NextFunction, Request, Response } from 'express';
import { CreateCustomerInputs } from '../dto/customer.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  onRequestOtp,
} from '../utility';
import { Customer } from '../models';

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
  const customerInputs = plainToClass(CreateCustomerInputs, req.body);

  const inputErrors = await validate(customerInputs, { validationError: { target: true } });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password } = customerInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = GenerateOtp();
  const existingCustomer = Customer.findOne({ email: email });

  if (existingCustomer !== null) {
    return res.status(409).json({ message: 'Customer already exists' });
  }

  const result = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: '',
    lastName: '',
    address: '',
    verified: false,
    lat: 0,
    lng: 0,
  });

  if (result) {
    await onRequestOtp(otp, phone);

    const signature = GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });

    return res
      .status(201)
      .json({ signature: signature, verified: result.verified, email: result.email });
  }
  return res.status(400).json({ message: 'Error with Signup' });
};

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {};

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {};

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {};

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {};

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {};
