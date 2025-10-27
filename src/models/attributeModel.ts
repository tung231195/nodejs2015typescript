import mongoose, { Schema, Document, Types } from "mongoose";
import { IAttributeDoc } from "../types";
import slugify from "slugify";

export const AttributeSchema = new Schema<IAttributeDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: false, lowercase: true, unique: true, trim: true },
    type: { type: String, enum: ["string", "number", "boolean", "enum"], default: "string" },
    options: [{ value: String, label: String }],
    unit: { type: String },
    isFilterable: { type: Boolean, default: true },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

AttributeSchema.index({ slug: 1 });
AttributeSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: "vi" });
  }
  next();
});

export const AttributeModel = mongoose.model<IAttributeDoc>("Attribute", AttributeSchema);
