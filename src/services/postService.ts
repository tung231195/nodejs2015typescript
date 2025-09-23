// services/postService.ts

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

export const getPostById = async (id: string): Promise<IPostDoc | null> => {
  try {
    return await PostModel.findById(id).populate("author");
  } catch (error: any) {
    console.error("Error in getPostById:", error.message);
    throw new Error("Failed to fetch post");
  }
};

export const getAllPosts = async (): Promise<IPostDoc[]> => {
  try {
    return await PostModel.find().populate("author");
  } catch (error: any) {
    console.error("Error in getAllPosts:", error.message);
    throw new Error("Failed to fetch posts");
  }
};
