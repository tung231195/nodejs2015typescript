import mongoose, { Schema } from "mongoose";
import { ISlideshowDoc } from "../types";

const SlideshowSchema = new Schema<ISlideshowDoc>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    status: {
      type: String,
      enum: ["enable", "disabled"],
      default: "disabled",
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    image: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true },
);

export const SlideshowModel = mongoose.model<ISlideshowDoc>("Slideshow", SlideshowSchema);
