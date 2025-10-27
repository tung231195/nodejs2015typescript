import mongoose, { Schema } from "mongoose";
import { IAddressItemDoc } from "../types";

const AddressSchema = new Schema<IAddressItemDoc>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    province: { label: String, value: String },
    district: { label: String, value: String },
    ward: { label: String, value: String },
    email: { type: String, required: true },
    postalCode: { type: String, required: true },
    company: { type: String, required: true },
    note: { type: String, required: true },
    isDefault: { type: Boolean, required: true },
  },
  { timestamps: true },
);

export const AddressModel = mongoose.model<IAddressItemDoc>("Address", AddressSchema);
