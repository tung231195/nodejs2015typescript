// controllers/postController.ts
import { Request, Response } from "express";
import * as postService from "../services/postService.js";

export const createPost = async (req: Request, res: Response) => {
  try {
    const post = await postService.createPost(req.body);
    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  console.log("update post", req.body);
  try {
    const post = await postService.updatePost(req.body);
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

export const deletePostById = async (req: Request, res: Response) => {
  try {
    const deleted = await postService.deletePostById(req.params.id);
    res.json(deleted);
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};
