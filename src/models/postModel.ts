import mongoose, { Schema, Document, Types } from "mongoose";
import { IPost } from "../interfaces/post.interface.js";
export type IPostDoc = IPost & Document<Types.ObjectId>;
const PostSchema = new Schema<IPostDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true },
);
export const PostModel = mongoose.model<IPostDoc>("Post", PostSchema);
