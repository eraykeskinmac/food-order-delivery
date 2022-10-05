import mongoose from 'mongoose';
import { MONGO_URI } from '../config';

export default async () => {
  try {
    await mongoose.connect(MONGO_URI as string, {});
    console.log('DB Connected');
  } catch (e) {
    console.log(e);
  }
};
