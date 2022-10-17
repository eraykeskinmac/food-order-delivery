export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodType: [string];
  pinCode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface EditVendorInputs {
  name: string;
  address: string;
  phone: string;
  foodTypes: [string];
}

export interface VendorLoginInputs {
  email: string;
  password: string;
}

export interface VendorPayload {
  _id: string;
  email: string;
  name: string;
  foodTypes: [string];
}

export interface CreateOfferInput {
  offerType: string;
  vendors: [any];
  title: string;
  description: string;
  minValue: number;
  offerAmount: number;
  startValidity: Date;
  endValidity: Date;
  promocode: string;
  promoType: string;
  bank: [any];
  bins: [any];
  pincode: string;
  isActive: boolean;
}
