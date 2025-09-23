import mongoose, { Schema, Document, Types } from 'mongoose';
export interface ITokenDoc extends Document<Types.ObjectId> {
  userId: Types.ObjectId;
  token: string;
}
const TokenSchema = new Schema<ITokenDoc>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
}, { timestamps: true });
export const TokenModel = mongoose.model<ITokenDoc>('Token', TokenSchema);
