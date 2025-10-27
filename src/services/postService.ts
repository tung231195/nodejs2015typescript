// services/postService.ts

import { LikeModel } from "../models/likeModel.js";
import { IPostDoc, PostModel } from "../models/postModel.js";

export const createPost = async (data: Partial<IPostDoc>): Promise<IPostDoc> => {
  try {
    const post = new PostModel(data);
    return await post.save();
  } catch (error: any) {
    console.error("Error in createPost:", error.message);
    throw new Error("Failed to create post");
  }
};

export const updatePost = async (
  data: { _id: string } & Partial<Omit<IPostDoc, "_id" | "user">>,
): Promise<IPostDoc> => {
  try {
    // const { id, title, content } = data;
    const updatedPost = await PostModel.findByIdAndUpdate(
      data._id,
      { $set: data },
      { new: true, runValidators: true },
    );
    if (!updatedPost) throw new Error("The update post not exist");
    return updatedPost;
  } catch (error: any) {
    console.error("Error in createPost:", error.message);
    throw new Error("Failed to create post");
  }
};

export const getPostById = async (id: string): Promise<IPostDoc | null> => {
  try {
    return await PostModel.findById(id).populate("user");
  } catch (error: any) {
    console.error("Error in getPostById:", error.message);
    throw new Error("Failed to fetch post");
  }
};

export const getAllPosts = async (): Promise<IPostDoc[]> => {
  try {
    const posts = await PostModel.find().populate("user").lean();
    const postsWithLikes = await Promise.all(
      posts.map(async (p) => {
        const likes = await LikeModel.find({ post: p._id })
          .populate("user", "_id name email")
          .lean();
        return { ...p, likes, likesCount: likes.length };
      }),
    );
    console.log("post like data", postsWithLikes);
    return postsWithLikes;
  } catch (error: any) {
    console.error("Error in getAllPosts:", error.message);
    throw new Error("Failed to fetch posts");
  }
};

/**
 * Delet  Post theo ID
 */
export const deletePostById = async (id: string) => {
  try {
    const deletePost = await PostModel.findByIdAndDelete(id);

    if (!deletePost) {
      throw new Error("post not found");
    }

    return {
      success: true,
      message: "post deleted successfully",
      data: deletePost,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete post");
  }
};
