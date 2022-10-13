"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.get('/:pinCode', controllers_1.GetFoodAvailability);
router.get('/top-restaurants/:pinCode', controllers_1.GetTopRestaurants);
router.get('/foods-in-30-min/:pinCode', controllers_1.GetFoodIn30Min);
router.get('/search/:pinCode', controllers_1.SearchFood);
router.get('/restaurant/:id', controllers_1.RestaurantById);
exports.default = router;
