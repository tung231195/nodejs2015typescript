// controllers/postController.ts
import { Request, Response } from "express";
import * as fakeService from "../services/fakeService.js";

export const generateProducts = async (req: Request, res: Response) => {
  try {
    const post = await fakeService.generateProducts();
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
