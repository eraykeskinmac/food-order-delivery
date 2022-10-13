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
exports.getFoods = exports.addFood = exports.updateVendorService = exports.updateVendorCoverImage = exports.updateVendorProfile = exports.getVendorProfile = exports.vendorLogin = void 0;
const Food_1 = require("../models/Food");
const utility_1 = require("../utility");
const adminController_1 = require("./adminController");
const vendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield (0, adminController_1.FindVendor)('', email);
    if (existingVendor !== null) {
        const validation = yield (0, utility_1.ValidatePassword)(password, existingVendor.password, existingVendor.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: existingVendor.id,
                email: existingVendor.email,
                foodTypes: existingVendor.foodType,
                name: existingVendor.name,
            });
            return res.json(signature);
        }
        else {
            return res.json({ message: 'Invalid password' });
        }
    }
    return res.json({ message: 'Login credentials are incorrect' });
});
exports.vendorLogin = vendorLogin;
const getVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, adminController_1.FindVendor)(user._id);
        return res.json(existingVendor);
    }
    return res.json({ message: 'Vendor information not found' });
});
exports.getVendorProfile = getVendorProfile;
const updateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { foodTypes, name, address, phone } = req.body;
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, adminController_1.FindVendor)(user._id);
        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodTypes;
            const savedResults = yield existingVendor.save();
            return res.json(savedResults);
        }
        return res.json(existingVendor);
    }
    return res.json({ message: 'Vendor information not found' });
});
exports.updateVendorProfile = updateVendorProfile;
const updateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vendor = yield (0, adminController_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vendor.coverImages.push(...images);
            const result = yield vendor.save();
            return res.json(result);
        }
    }
    return res.json({ message: 'Vendor information not found' });
});
exports.updateVendorCoverImage = updateVendorCoverImage;
const updateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, adminController_1.FindVendor)(user._id);
        if (existingVendor !== null) {
            existingVendor.serviceAvailability = !existingVendor.serviceAvailability;
            const savedResults = yield existingVendor.save();
            return res.json(savedResults);
        }
        return res.json(existingVendor);
    }
    return res.json({ message: 'Vendor information not found' });
});
exports.updateVendorService = updateVendorService;
const addFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vendor = yield (0, adminController_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const createFood = yield Food_1.Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                readyTime: readyTime,
                images: images,
                price: price,
                rating: 0,
            });
            vendor.foods.push(createFood);
            const result = yield vendor.save();
            return res.json(result);
        }
    }
});
exports.addFood = addFood;
const getFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield Food_1.Food.find({ vendorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ message: 'Foods information not found' });
});
exports.getFoods = getFoods;
