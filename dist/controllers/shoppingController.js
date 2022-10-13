"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantById = exports.SearchFood = exports.GetFoodIn30Min = exports.GetTopRestaurants = exports.GetFoodAvailability = void 0;
const models_1 = require("../models");
const GetFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pinCode = req.params.pinCode;
    const result = yield models_1.Vendor.find({ pinCode: pinCode, serviceAvailability: false })
        .sort([['rating', 'descending']])
        .populate('foods');
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(400).json({ message: 'Data not found!' });
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pinCode = req.params.pinCode;
    const result = yield models_1.Vendor.find({ pinCode: pinCode, serviceAvailability: false })
        .sort([['rating', 'descending']])
        .limit(10);
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(400).json({ message: 'Data not found!' });
});
exports.GetTopRestaurants = GetTopRestaurants;
const GetFoodIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pinCode = req.params.pinCode;
    const result = yield models_1.Vendor.find({ pinCode: pinCode, serviceAvailability: false }).populate('foods');
    if (result.length > 0) {
        let foodResult = [];
        result.map((vendor) => {
            const foods = vendor.foods;
            foodResult.push(...foods.filter((food) => food.readyTime <= 30));
        });
        return res.status(200).json(foodResult);
    }
    return res.status(400).json({ message: 'Data not found!' });
});
exports.GetFoodIn30Min = GetFoodIn30Min;
const SearchFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pinCode = req.params.pinCode;
    const result = yield models_1.Vendor.find({ pinCode: pinCode, serviceAvailability: false }).populate('foods');
    if (result.length > 0) {
        let foodResult = [];
        result.map((item) => foodResult.push(...item.foods));
        return res.status(200).json(foodResult);
    }
    return res.status(400).json({ message: 'Data not found!' });
});
exports.SearchFood = SearchFood;
const RestaurantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield models_1.Vendor.findById(id).populate('foods');
    if (result) {
        return res.status(200).json(result);
    }
    return res.status(400).json({ message: 'Data not found!' });
});
exports.RestaurantById = RestaurantById;
