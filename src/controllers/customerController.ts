import { NextFunction, Request, Response } from 'express';
import { CreateCustomerInputs, UserLoginInputs } from '../dto/customer.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  onRequestOtp,
  ValidatePassword,
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

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
  const loginInputs = plainToClass(UserLoginInputs, req.body);

  const loginErrors = await validate(loginInputs, { validationError: { target: true } });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }
  const { email, password } = loginInputs;
  const customer = await Customer.findOne({ email: email });

  if (customer) {
    const validation = await ValidatePassword(password, customer.password, customer.salt);

    if (validation) {
      const signature = GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });

      return res
        .status(201)
        .json({ signature: signature, verified: customer.verified, email: customer.email });
    }
  }
  return res.status(404).json({ message: 'Error with Login' });
};

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedCustomerResponse = await profile.save();

        const signature = GenerateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });
        return res.status(201).json({
          signature: signature,
          verified: updatedCustomerResponse.verified,
          email: updatedCustomerResponse.email,
        });
      }
    }
  }
  return res.status(400).json({ message: 'Error with OTP Validation' });
};

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { otp, expiry } = GenerateOtp();

      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();
      await onRequestOtp(otp, profile.phone);

      res.status(200).json({ message: 'OTP sent your registered phone number!' });
    }
  }
  res.status(400).json({ message: 'Error with OTP Request' });
};

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {};

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {};
