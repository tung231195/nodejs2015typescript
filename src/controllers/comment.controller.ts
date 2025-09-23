// controllers/commentController.ts
import { Request, Response } from "express";
import * as commentService from "../services/commentService.js";

export const createComment = async (req: Request, res: Response) => {
  try {
    const comment = await commentService.createComment(req.body);
    res.status(201).json(comment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const comments = await commentService.getCommentsByPost(req.params.postId);
    res.json(comments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
