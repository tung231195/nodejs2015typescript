import mongoose, { Schema, Document, Types } from 'mongoose';
export type ILikeDoc = Document<Types.ObjectId> & { user: Types.ObjectId; post: Types.ObjectId; };
const LikeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: true });
export const LikeModel = mongoose.model<ILikeDoc>('Like', LikeSchema);
