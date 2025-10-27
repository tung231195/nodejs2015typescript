import mongoose, { Schema, Document, Types } from "mongoose";
import { ICategoryDoc } from "../types";
import slugify from "slugify";

const CategorySchema = new Schema<ICategoryDoc>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true },
);

CategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: "vi" });
  }
  next();
});

export const CategoryModel = mongoose.model<ICategoryDoc>("Category", CategorySchema);
