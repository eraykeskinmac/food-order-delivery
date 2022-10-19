import express from 'express';
import {
  DeliveryLogin,
  DeliverySignUp,
  EditDeliveryProfile,
  GetDeliveryProfile,
  UpdateDeliveryUserStatus,
} from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.post('/signup', DeliverySignUp);

router.post('/login', DeliveryLogin);

router.use(Authenticate);

router.put('/change-status', UpdateDeliveryUserStatus);

router.get('/profile', GetDeliveryProfile);
router.patch('/profile', EditDeliveryProfile);

export { router as DeliveryRoute };
