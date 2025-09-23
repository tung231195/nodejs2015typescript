// controllers/postController.ts
import { Request, Response } from "express";
import * as postService from "../services/postService";

export const createPost = async (req: Request, res: Response) => {
  try {
    const post = await postService.createPost(req.body);
    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
