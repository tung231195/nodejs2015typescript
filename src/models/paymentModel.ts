import mongoose, { Schema, Document, Types } from "mongoose";
import { IPaymentItemDoc } from "../types";

export const PaymentSchema = new Schema<IPaymentItemDoc>(
  {
    method: {
      type: String,
      enum: ["paypal", "stripe", "momo", "cod"],
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      lowercase: true,
      trim: true,
    },
    transactionId: {
      type: String,
      trim: true,
      default: "",
    },
    paidAt: {
      type: Date,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "VND",
      uppercase: true,
      trim: true,
    },
    rawResponse: {
      type: Schema.Types.Mixed, // dùng Mixed thay vì any
      default: {},
    },
  },
  { timestamps: true },
);

export const PaymentMethodModel = mongoose.model<IPaymentItemDoc>("Payment", PaymentSchema);
