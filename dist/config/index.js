"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_SECRET = exports.MONGO_URI = void 0;
require('dotenv').config();
exports.MONGO_URI = process.env.MONGO_URI;
exports.APP_SECRET = process.env.APP_SECRET;
