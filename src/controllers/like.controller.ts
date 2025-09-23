// controllers/likeController.ts
import { Request, Response } from "express";
import * as likeService from "../services/likeService";
import { LikeModel } from "../models/likeModel";

export const likePost = async (req: Request, res: Response) => {
  try {
    const like = await likeService.likePost(req.body);
    res.status(201).json(like);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLikesByPost = async (req: Request, res: Response) => {
  try {
    const likes = await likeService.getLikesByPost(req.params.postId);
    res.json(likes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



export const unlikePost = async (req: Request, res: Response) => {
  try {
    const { userId, postId } = req.body;
    await LikeModel.findOneAndDelete({ user: userId, post: postId });
    res.json({ message: "Unliked post" });
  } catch (err) {
    res.status(500).json({ error: "Error unliking post" });
  }
};