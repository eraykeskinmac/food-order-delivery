import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import {
  addFood,
  getFoods,
  GetOrderDetails,
  GetOrders,
  getVendorProfile,
  ProcessOrder,
  updateVendorCoverImage,
  updateVendorProfile,
  updateVendorService,
  vendorLogin,
} from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + '_' + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array('images', 10);

router.post('/login', vendorLogin);

router.use(Authenticate);
router.get('/profile', Authenticate, getVendorProfile);
router.patch('/profile', updateVendorProfile);
router.patch('/coverImage', images, updateVendorCoverImage);
router.patch('/service', updateVendorService);

router.post('/food', images, addFood);
router.get('/foods', getFoods);

router.get('/orders', GetOrders);
router.get('/order/:id/process', ProcessOrder);
router.get('/order/:id', GetOrderDetails);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Hello vendor' });
});

export { router as vendorRoute };
