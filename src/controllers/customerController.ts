import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import {
  CreateCustomerInputs,
  EditCustomerProfileInputs,
  OrderInputs,
  UserLoginInputs,
} from '../dto/customer.dto';
import { Customer, Food } from '../models';
import { Order } from '../models/Order';
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  onRequestOtp,
  ValidatePassword,
} from '../utility';

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
    orders: [],
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

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      return res.status(200).json(profile);
    }
  }
  return res.status(400).json({ message: 'Error with Fetch Profile' });
};

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;
  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);
  const profileErrors = await validate(profileInputs, { validationError: { target: false } });

  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }

  const { firstName, lastName, address } = profileInputs;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      profile.firstName;
      profile.lastName;
      profile.address;

      const result = await profile.save();
      res.status(200).json(result);
    }
  }
};

export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate('cart.food');
    let cartItems = Array();

    const { _id, unit } = <OrderInputs>req.body;

    const food = await Food.findById(_id);

    if (food) {
      if (profile != null) {
        //check for cart items
        cartItems = profile.cart;

        if (cartItems.length > 0) {
          // check  and update unit
          let existFoodItem = cartItems.filter(item => item.food._id.toString() === _id);
          if (existFoodItem.length > 0) {
            const index = cartItems.indexOf(existFoodItem[0]);
            if (unit > 0) {
              cartItems[index] = { food, unit };
            } else {
              cartItems.splice(index, 1);
            }
          } else {
            cartItems.push({ food, unit });
          }
        } else {
          // add new item to cart
          cartItems.push({ food, unit });
        }
        if (cartItems) {
          profile.cart = cartItems as any;
          const cartresult = await profile.save();
          return res.status(200).json(cartresult.cart);
        }
      }
    }
  }
  return res.status(400).json({ message: 'Unable to create Cart!' });
};

export const GetCart = async (req: Request, res: Response, next: NextFunction) => {};

export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {};

export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const orderId = `${Math.floor(Math.random() * 899999) + 10000}`;

    const profile = await Customer.findById(customer._id);

    const cart = <[OrderInputs]>req.body;

    let cartItem = Array();

    let netAmount = 0.0;

    const food = await Food.find()
      .where('_id')
      .in(cart.map(item => item._id))
      .exec();

    food.map(food => {
      cart.map(({ _id, unit }) => {
        if (food._id === _id) {
          netAmount -= food.price * unit;
          cartItem.push({ food, unit });
        }
      });
    });

    if (cartItem) {
      const currentOrder = await Order.create({
        orderId: orderId,
        items: cartItem,
        totalAmount: netAmount,
        orderDate: new Date(),
        paidThrough: 'CDD',
        paymentResponse: '',
        orderStatus: 'Waiting',
      });

      if (currentOrder) {
        profile.orders.push(currentOrder);
        await profile.save();

        return res.status(200).json(currentOrder);
      }
    }
  }
  return res.status(400).json({ message: 'Error with Create Order' });
};

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate('orders');

    if (profile) {
      return res.status(200).json(profile.orders);
    }
  }
};

export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate('items.food');
    res.status(200).json(order);
  }
};
