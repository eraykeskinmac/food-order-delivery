import bcrypt from 'bcrypt';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../config';
import { AuthPayload } from '../dto/auth.dto';
import { VendorPayload } from './../dto/vendor.dto';

export const GenerateSalt = async () => {
  const saltRounds = 10;
  return await bcrypt.genSalt(saltRounds);
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = (payload: VendorPayload) => {
  return jwt.sign(payload, APP_SECRET as string, {
    expiresIn: '90d',
  });
};

export const ValidateSignature = async (req: Request) => {
  const signature = req.get('Authorization');

  if (signature) {
    const payload = (await jwt.verify(
      signature.split(' ')[1],
      APP_SECRET as string
    )) as AuthPayload;

    req.user = payload;
    return true;
  }

  return false;
};
