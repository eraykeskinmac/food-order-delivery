import { IsEmail, IsEmpty, Length } from 'class-validator';

export class CreateCustomerInputs {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @IsEmpty()
  @Length(6, 12)
  password: string;
}

export class UserLoginInputs {
  @IsEmail()
  email: string;

  @IsEmpty()
  @Length(6, 12)
  password: string;
}

export class EditCustomerProfileInputs {
  @Length(3, 16)
  firstName: string;

  @Length(3, 16)
  lastName: string;

  @Length(6, 16)
  address: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export class CartItem {
  _id: string;
  unit: number;
}

export class OrderInputs {
  txnId: string;
  amount: string;
  items: [CartItem];
}

export class CreateDeliveryUserInputs {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;

  @Length(3, 12)
  firstName: string;

  @Length(3, 12)
  lastName: string;

  @Length(6, 24)
  address: string;

  @Length(4,12)
  pincode: string
}
