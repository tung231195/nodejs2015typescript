import mongoose, { Schema } from "mongoose";
import { IVariantDoc } from "../types";
import { ProductAttributeValueDocSchema } from "./productAttributeValueModel";

export const VariantSchema = new Schema<IVariantDoc>({
  sku: { type: String },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  stock: { type: Number, default: 0 },
  attributes: [ProductAttributeValueDocSchema],
  images: [String],
});

export const VariantModel = mongoose.model<IVariantDoc>("Variant", VariantSchema);
