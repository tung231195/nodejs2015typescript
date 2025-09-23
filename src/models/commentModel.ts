import mongoose, { Schema, Document, Types } from 'mongoose';
import { IComment } from '../interfaces/comment.interface.js';
export type ICommentDoc = IComment & Document<Types.ObjectId>;
const CommentSchema = new Schema<ICommentDoc>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  content: { type: String, required: true },
}, { timestamps: true });
export const CommentModel = mongoose.model<ICommentDoc>('Comment', CommentSchema);
