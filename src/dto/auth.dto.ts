import { VendorPayload } from './vendor.dto';
import { CustomerPayload } from './customer.dto';

export type AuthPayload = VendorPayload | CustomerPayload;
