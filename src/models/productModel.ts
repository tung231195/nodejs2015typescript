import mongoose, { Schema } from "mongoose";
import { IProductDoc } from "../types";
import slugify from "slugify";
import { VariantSchema } from "./variantModel.js";
import { ProductAttributeValueDocSchema } from "./productAttributeValueModel.js";

const ProductSchema = new Schema<IProductDoc>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    attributes: [ProductAttributeValueDocSchema],
    variants: [VariantSchema],
    description: {
      type: String,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true },
);
ProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: "vi" });
  }
  next();
});
export const ProductModel = mongoose.model<IProductDoc>("Product", ProductSchema);
