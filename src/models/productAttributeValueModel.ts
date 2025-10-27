import mongoose, { Schema } from "mongoose";
import { IProductAttributeValueDoc } from "../types";

export const ProductAttributeValueDocSchema = new Schema<IProductAttributeValueDoc>({
  attribute: { type: Schema.Types.ObjectId, ref: "Attribute", required: true },
  valueString: String,
  valueNumber: Number,
  valueBoolean: Boolean,
});

export const ProductAttributeValueModel = mongoose.model<IProductAttributeValueDoc>(
  "ProductAttributeValue",
  ProductAttributeValueDocSchema,
);
