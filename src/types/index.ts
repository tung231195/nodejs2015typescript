import { Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserDoc extends IUser, Document {
    comparePassword(password: string): Promise<boolean>;
}

export interface IPost {
  user: string;
  content: string;
  likes: string[];
}

export interface IPostDoc extends IPost, Document {}

export interface IComment {
  post: string;
  user: string;
  content: string;
  likes: string[];
}

export interface ICommentDoc extends IComment, Document {}
