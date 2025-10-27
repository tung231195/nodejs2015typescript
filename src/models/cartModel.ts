import mongoose, { Schema, Document } from "mongoose";
import { IOrderItemDoc } from "../types";

export interface ICartDoc extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItemDoc[];
}

const cartSchema = new Schema<ICartDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: String,
      },
    ],
  },
  { timestamps: true },
);

export const CartModel = mongoose.model<ICartDoc>("Cart", cartSchema);
