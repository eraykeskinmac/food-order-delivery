import mongoose, { Document, Schema } from 'mongoose';

export interface OfferDoc extends Document {
  offerType: string;
  vendors: [any];
  title: string;
  description: string;
  minValue: number;
  offerAmount: number;
  startValidity: Date;
  endValidity: Date;
  promocode: string;
  promoType: string;
  bank: [any];
  bins: [any];
  pincode: string;
  isActive: boolean;
}

const offerSchema = new Schema(
  {
    offerType: { type: String, required: true },
    vendors: [{ type: Schema.Types.ObjectId, ref: 'vendor' }],
    title: { type: String, require: true },
    description: String,
    minValue: { type: Number, required: true },
    offerAmount: { type: Number, required: true },
    startValidity: Date,
    endValidity: Date,
    promocode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [{ type: String }],
    bins: [
      {
        type: Number,
      },
    ],
    pincode: { typeo: String, required: true },
    isActive: Boolean,
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },

    timestamps: true,
  },
);

const Offer = mongoose.model<OfferDoc>('offer', offerSchema);

export { Offer };
