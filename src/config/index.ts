require('dotenv').config();

export const MONGO_URI = process.env.MONGO_URI;
export const APP_SECRET = process.env.APP_SECRET;
export const PORT = process.env.PORT || 8000;
