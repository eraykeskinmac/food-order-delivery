import mongoose, { Document, Schema } from "mongoose";

interface FoodDoc extends Document {
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyTime: number;
  price: number;
  rating: number;
  images: [string];
}

const foodSchema = new Schema(
  {
    vendorId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    foodType: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number },
    rating: { type: Number },
    images: { type: [String] },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },

    timestamps: true,
  }
);

const Food = mongoose.model<FoodDoc>("food", foodSchema);

export { Food };
