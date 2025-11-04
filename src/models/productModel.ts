import mongoose, { Schema } from "mongoose";
import { IProductDoc } from "../types";
import slugify from "slugify";
import { VariantSchema } from "./variantModel.js";
import { ProductAttributeValueDocSchema } from "./productAttributeValueModel.js";
const DiscountSchema = new Schema(
  {
    type: { type: String, enum: ["percent", "amount"], required: true },
    value: { type: Number, required: true },
  },
  { _id: false },
);

const ProductSchema = new Schema<IProductDoc>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    type: {
      type: String,
      enum: ["simple", "variant"],
      default: "simple",
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    discount: {
      type: DiscountSchema,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    endDate: {
      type: Date,
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
    finalPrice: {
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
ProductSchema.pre("save", function (next) {
  const product = this as IProductDoc;

  if (product.discount) {
    if (product.discount.type === "percent") {
      product.finalPrice = Math.max(
        0,
        product.price - (product.price * product.discount.value) / 100,
      );
    } else if (product.discount.type === "amount") {
      product.finalPrice = Math.max(0, product.price - product.discount.value);
    } else {
      product.finalPrice = product.price;
    }
  } else {
    product.finalPrice = product.price;
  }

  next();
});

export const ProductModel = mongoose.model<IProductDoc>("Product", ProductSchema);
