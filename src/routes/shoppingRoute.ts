import express from 'express';
import {
  GetAvailableOffers,
  GetFoodAvailability,
  GetFoodIn30Min,
  GetTopRestaurants,
  RestaurantById,
  SearchFood,
} from '../controllers';

const router = express.Router();

router.get('/:pinCode', GetFoodAvailability);
router.get('/top-restaurants/:pinCode', GetTopRestaurants);
router.get('/foods-in-30-min/:pinCode', GetFoodIn30Min);
router.get('/search/:pinCode', SearchFood);
router.get('/offers/:pincode', GetAvailableOffers);
router.get('/restaurant/:id', RestaurantById);

export default router;
