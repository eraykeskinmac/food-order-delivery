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
