import express from 'express';
import {
  AddToCart,
  CreateOrder,
  CreatePayment,
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  DeleteCart,
  EditCustomerProfile,
  GetCart,
  GetCustomerProfile,
  GetOrderById,
  GetOrders,
  RequestOtp,
  VerifyOffer,
} from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.post('/signup', CustomerSignUp);
router.post('/login', CustomerLogin);
router.use(Authenticate);
router.patch('/verify', CustomerVerify);
router.get('/otp', RequestOtp);
router.get('/profile', GetCustomerProfile);
router.patch('/profile', EditCustomerProfile);
router.post('/create-order', CreateOrder);
router.get('/orders', GetOrders);
router.get('/order/:id', GetOrderById);
router.post('/cart', AddToCart);
router.get('/cart', GetCart);
router.delete('/cart', DeleteCart);
router.get('/offer/verify/:id', VerifyOffer);
router.post('/create-payment', CreatePayment);

export { router as customerRoute };
