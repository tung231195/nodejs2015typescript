import mongoose, { Schema, Document, Types } from "mongoose";
import slugify from "slugify";
import { IDeliveryItemDoc } from "../types";
import { number, string } from "@paypal/paypal-server-sdk/dist/types/schema";

export const DeliverySchema = new Schema<IDeliveryItemDoc>(
  {
    method: {
      type: String,
      enum: ["ghn", "ghtk", "vnpost", "grab", "manual"],
      required: true,
      default: "manual",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      lowercase: true,
      unique: true,
      trim: true,
    },
    trackingNumber: {
      type: String,
    },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    shippingFee: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const DeliveryModel = mongoose.model<IDeliveryItemDoc>("Delivery", DeliverySchema);
