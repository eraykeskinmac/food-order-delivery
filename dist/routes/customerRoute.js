"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.customerRoute = router;
router.post('/signup', controllers_1.CustomerSignUp);
router.post('/login', controllers_1.CustomerLogin);
router.use(middlewares_1.Authenticate);
router.patch('/verify', controllers_1.CustomerVerify);
router.get('/otp', controllers_1.RequestOtp);
router.get('/profile', controllers_1.GetCustomerProfile);
router.patch('/profile', controllers_1.EditCustomerProfile);
