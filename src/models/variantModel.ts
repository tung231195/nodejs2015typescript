import mongoose, { Schema } from "mongoose";
import { IVariantDoc } from "../types";
import { ProductAttributeValueDocSchema } from "./productAttributeValueModel.js";

export const VariantSchema = new Schema<IVariantDoc>({
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  stock: { type: Number, required: true, default: 0 },
  attributes: [ProductAttributeValueDocSchema],
  images: [String],
});

export const VariantModel = mongoose.model<IVariantDoc>("Variant", VariantSchema);
