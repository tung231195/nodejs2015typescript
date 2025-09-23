// services/likeService.ts

import { ILikeDoc, LikeModel } from "../models/likeModel";

export const likePost = async (data: Partial<ILikeDoc>): Promise<ILikeDoc> => {
  try {
    const like = new LikeModel(data);
    return await like.save();
  } catch (error: any) {
    console.error("Error in likePost:", error.message);
    throw new Error("Failed to like post");
  }
};

export const getLikesByPost = async (postId: string): Promise<ILikeDoc[]> => {
  try {
    return await LikeModel.find({ post: postId }).populate("user");
  } catch (error: any) {
    console.error("Error in getLikesByPost:", error.message);
    throw new Error("Failed to fetch likes");
  }
};


