// controllers/slideshowController.ts
import { Request, Response } from "express";
import * as slideshowService from "../services/slideshowService .js";

export const createSlideshow = async (req: Request, res: Response) => {
  try {
    const slideshow = await slideshowService.createSlideshow(req.body);
    res.status(201).json(slideshow);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSlideshow = async (req: Request, res: Response) => {
  console.log("update slideshow", req.body);
  try {
    const slideshow = await slideshowService.updateSlideshow(req.body);
    res.status(201).json(slideshow);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSlideshow = async (req: Request, res: Response) => {
  try {
    const slideshow = await slideshowService.getSlideshowById(req.params.id);
    if (!slideshow) return res.status(404).json({ message: "Slideshow not found" });
    res.json(slideshow);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSlideshows = async (_req: Request, res: Response) => {
  try {
    const slideshows = await slideshowService.getAllSlideshows();
    res.json(slideshows);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSlideshowById = async (req: Request, res: Response) => {
  try {
    const deleted = await slideshowService.deleteSlideshowById(req.params.id);
    res.json(deleted);
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};
