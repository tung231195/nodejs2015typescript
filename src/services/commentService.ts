import { CommentModel, ICommentDoc } from "../models/commentModel";

// services/commentService.ts
export const createComment = async (data: Partial<ICommentDoc>): Promise<ICommentDoc> => {
  try {
    const comment = new CommentModel(data);
    return await comment.save();
  } catch (error: any) {
    console.error("Error in createComment:", error.message);
    throw new Error("Failed to create comment");
  }
};

export const getCommentsByPost = async (postId: string): Promise<ICommentDoc[]> => {
  try {
    return await CommentModel.find({ post: postId }).populate("author");
  } catch (error: any) {
    console.error("Error in getCommentsByPost:", error.message);
    throw new Error("Failed to fetch comments");
  }
};
