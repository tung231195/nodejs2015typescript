import { Types } from 'mongoose';
export interface IPost {
  user: Types.ObjectId;
  title: string;
  content: string;
}
