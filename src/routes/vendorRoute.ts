import express, { NextFunction, Request, Response } from 'express';
import { getVendorProfile, vendorLogin } from '../controllers';
import {
  updateVendorProfile,
  updateVendorService,
} from './../controllers/vendorController';
import { Authenticate } from './../middlewares/ommonAuth';

const router = express.Router();

router.post('/login', vendorLogin);

router.use(Authenticate);
router.get('/profile', Authenticate, getVendorProfile);
router.patch('/profile', updateVendorProfile);
router.patch('/service', updateVendorService);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Hello vendor' });
});

export { router as vendorRoute };
