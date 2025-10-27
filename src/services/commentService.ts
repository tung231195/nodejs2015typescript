import { CommentModel, ICommentDoc } from "../models/commentModel.js";
import { createClient } from "redis";
// services/commentService.ts
export const createComment = async (data: Partial<ICommentDoc>): Promise<ICommentDoc> => {
  try {
    const comment = new CommentModel(data);
    await comment.save();
    const result = await comment.populate("user", "_id name email");
    const publisher = createClient();
    await publisher.connect();
    await publisher.publish(
      "events",
      JSON.stringify({
        type: "comment.added",
        data: {
          _id: result._id,
          post: result.post,
          user: result.user,
          content: result.content,
        },
      }),
    );
    const resultPost = await comment.populate("post", "_id user title content");
    await publisher.publish(
      "events",
      JSON.stringify({
        type: "comment.notify",
        data: {
          _id: result._id,
          post: resultPost.post,
          user: result.user,
          content: result.content,
        },
      }),
    );

    return result;
  } catch (error: any) {
    console.error("Error in createComment:", error.message);
    throw new Error("Failed to create comment");
  }
};

export const getCommentsByPost = async (postId: string): Promise<ICommentDoc[]> => {
  try {
    return await CommentModel.find({ post: postId }).populate("user", "_id name email");
  } catch (error: any) {
    console.error("Error in getCommentsByPost:", error.message);
    throw new Error("Failed to fetch comments");
  }
};
